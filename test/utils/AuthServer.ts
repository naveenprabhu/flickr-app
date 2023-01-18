/* eslint @typescript-eslint/ban-ts-comment: 0 */
/* eslint prefer-destructuring: 0 */

import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import fastify from "fastify";
import { inspect } from "util";
import { getLogger } from "../../src/utils/Logging";
import jwksClient from "jwks-rsa";
import { pem2jwk } from "pem-jwk";
import crypto from "crypto";

export class AuthServer {
  private keyIdPrefix = "local_dsw_api_kid";
  private authServer = fastify();
  private logger = getLogger();
  private cryptoAssets: ICryptoAsset[] = [];
  private jwks: IJwks;
  private jwtPaths: IAuthServerEndpoint = {
    keyStoreUri: "/local-auth/.well-known/jwks.json",
    tokenUri: "/local-auth/token/:bccContactId",
    verifyUri: "/local-auth/token/verify",
  };
  private keyStoreClient = jwksClient({
    jwksUri: this.jwtPaths.keyStoreUri,
  });

  constructor(keys: number) {
    this.cryptoAssets = this.generateCryptoAssets(keys);
    this.jwks = this.generateKeyStore();
    this.setupRoutes();
  }

  async startServer(): Promise<void> {
    this.logger.info("Starting auth server...");
    process.env.AUTH_SERVER_ADDRESS = await this.authServer.listen(0);
    this.logger.info(
      `Auth server started @ ${process.env.AUTH_SERVER_ADDRESS}`
    );
  }

  async stopServer(): Promise<void> {
    await this.authServer.close();
    this.logger.info("Auth server stopped");
  }

  generateCryptoAssets(keys: number): ICryptoAsset[] {
    const assets: ICryptoAsset[] = [];
    for (let i = 0; i < keys; i++) {
      let passphrase = uuidv4();

      // hack: passphrase is undefined
      if (!passphrase) {
        passphrase = "i-am-unstopable";
      }

      // The `generateKeyPairSync` method accepts two arguments:
      // 1. The type ok keys we want, which in this case is "rsa"
      // 2. An object with the properties of the key
      const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
          cipher: "aes-256-cbc",
          passphrase,
        },
      });

      const currentJwk: IKey = pem2jwk(publicKey) as unknown as IKey;
      currentJwk.use = "sig";
      currentJwk.kid = `${this.keyIdPrefix}_${i}`;

      const cryptoAsset: ICryptoAsset = {
        key: currentJwk.kid,
        Jwk: currentJwk,
        privateKey,
        passphrase,
        algorithm: "RS256",
      };
      assets.push(cryptoAsset);
    }
    this.logger.debug(`${assets.map((x) => JSON.stringify(x.Jwk))}`);
    return assets;
  }

  // generate key store from our crypto assets
  generateKeyStore(): IJwks {
    const jwks: IJwks = {
      keys: this.cryptoAssets.map((cryptoAsset) => {
        return cryptoAsset.Jwk;
      }),
    };
    return jwks;
  }

  getBearerToken(bccContactId: string): any {
    if (this.cryptoAssets.length < 1) return "";

    const randomkeyIndex = this.randomIntGenerator(
      0,
      this.cryptoAssets.length - 1
    );
    const cryptoKeyToUse = this.cryptoAssets[randomkeyIndex];
    const token = jwt.sign(
      {
        contact_id: bccContactId,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      {
        key: cryptoKeyToUse.privateKey,
        passphrase: cryptoKeyToUse.passphrase,
      },
      {
        algorithm: cryptoKeyToUse.algorithm,
        keyid: cryptoKeyToUse.key,
      }
    );
    const payload = {
      token,
      key: cryptoKeyToUse.key,
      bccContactId,
    };
    this.logger.debug(`${JSON.stringify(payload)}`);
    return payload;
  }

  // todo: current throwing 500 - "Cannot read property 'keyStoreClient' of undefined"
  // this is for internal testing only - does not impact any consuming resource
  verifyBearerToken(bearerToken: string): boolean {
    jwt.verify(
      bearerToken,
      this.getJwksKey,
      // @ts-ignore
      { algorithm: "RS256" },
      (err: any, decoded: any) => {
        if (!!err) {
          this.logger.error(`Token verification failed: ${err}`);
          return false;
        }

        if (decoded) {
          this.logger.debug(`Token verification passed: ${decoded}`);
          return true;
        }
      }
    );

    return false;
  }

  getJwksKey(header: any, callback: any) {
    this.keyStoreClient.getSigningKey(header.kid, (err: any, key: any) => {
      if (key) {
        const signingKey = key.publicKey || key.rsaPublicKey;
        this.logger.debug(`Found jwk: ${key}`);
        callback(null, signingKey);
      } else {
        this.logger.error(`Jwk not found. ${err}`);
        callback(err, null);
      }
    });
  }

  randomIntGenerator(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  setupRoutes(): void {
    this.authServer.get(
      `${this.jwtPaths.keyStoreUri}`,
      {},
      async (request, reply) => {
        this.logger.debug(
          `Received request in ${
            this.jwtPaths.keyStoreUri
          } with body: ${inspect(request.body)}, params: ${inspect(
            request.params
          )}, and headers: ${inspect(request.headers)}`
        );

        reply
          .code(200)
          .header("Content-Type", "application/json; charset=utf-8")
          .send(this.jwks);
      }
    );

    this.authServer.get(
      `${this.jwtPaths.tokenUri}`,
      {},
      async (request, reply) => {
        this.logger.debug(
          `Received request in ${this.jwtPaths.tokenUri} with body: ${inspect(
            request.body
          )}, params: ${inspect(request.params)}, and headers: ${inspect(
            request.headers
          )}`
        );

        // @ts-ignore
        const bccContactId = request.params["bccContactId"];

        reply
          .code(200)
          .header("Content-Type", "application/json; charset=utf-8")
          .send(this.getBearerToken(bccContactId));
      }
    );

    this.authServer.post(
      `${this.jwtPaths.verifyUri}`,
      {},
      async (request, reply) => {
        this.logger.debug(
          `Received request in ${this.jwtPaths.verifyUri} with body: ${inspect(
            request.body
          )}, params: ${inspect(request.params)}, and headers: ${inspect(
            request.headers
          )}`
        );

        // @ts-ignore
        const bearerToken = request.body["token"];

        const response = {
          status: this.verifyBearerToken(bearerToken),
        };

        reply
          .code(200)
          .header("Content-Type", "application/json; charset=utf-8")
          .send(response);
      }
    );
  }
}

interface IAuthServerEndpoint {
  keyStoreUri: string;
  tokenUri: string;
  verifyUri: string;
}

interface ICryptoAsset {
  key: string;
  Jwk: IKey;
  privateKey: string;
  passphrase: string;
  algorithm: "RS256";
}

interface IJwks {
  keys: IKey[];
}

interface IKey {
  alg?: string | null; // is the algorithm for the key
  kty: string; // is the key type
  use: string; // is how the key was meant to be used. For the example above, sig represents signature verification
  e: string; // is the exponent for a standard pem
  n: string; // is the moduluos for a standard pem
  kid: string; // is the unique identifier for the key
  x5c?: string | null; // is the x509 certificate chain
  x5t?: string | null; // is the thumbprint of the x.509 cert (SHA-1 thumbprint)
}