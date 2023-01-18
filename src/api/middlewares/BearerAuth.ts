/* eslint @typescript-eslint/ban-ts-comment: 0 */
import { formatError, getLogger } from "../../utils/Logging";
import { NextFunction, Request, Response } from "express";
import { IHttpError } from "../../interfaces/IApiV1Responses";
import { IApplicationConfig } from "../../interfaces/IConfig";
import config from "config";
import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";

const logger = getLogger();

export const bearerAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const applicationConfig: IApplicationConfig = config.get("application");
  if (
    !req.headers.authorization ||
    req.headers.authorization.indexOf("Bearer") === -1
  ) {
    logger.warn(`Request without authorization header is made to ${req.path}`);
    res.status(401).json({
      errorCode: 401,
      errorMessage: "Missing Authorization header",
    } as IHttpError);
    return;
  }

  const client = jwksClient({
    jwksUri: applicationConfig.jwksUri,
  });
  function getKey(header: any, callback: any) {
    client.getSigningKey(header.kid, function (err: any, key: any) {
      if (key) {
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
      } else {
        logger.warn(
          `An error occurred when authenticating token ${
            req.path
          } ${formatError(err)}`
        );
        callback(err, null);
      }
    });
  }
  const [, bearerToken] = req.headers.authorization.split(" ");

  jwt.verify(
    bearerToken,
    getKey,
    // @ts-ignore
    { algorithm: "RS256" },
    (err: any, decoded: any) => {
      next();
    }
  );
};
