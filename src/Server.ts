import Signals = NodeJS.Signals;
import express, { Express, Request, Response } from "express";
import { formatError, getLogger } from "./utils/Logging";
import { inspect } from "util";
import * as http from "http";
import { App } from "./App";
import { checkEnv } from "./utils/Helpers";

export class Server {
  private logger = getLogger();
  protected server: http.Server;
  private app: App;

  constructor() {
    checkEnv();
    this.app = new App();
    const ex = this.setupExpress();
    this.server = this.setupHttpServer(ex);
  }

  setupHttpServer(ex: Express): http.Server {
    const server = http.createServer(ex);
    server.on("error", (err) => {
      this.logger.warn(formatError(err));
    });
    this.logger.info("Setup HTTP Server");
    return server;
  }

  setupExpress(): Express {
    return express()
      .get("/healthz", (req: Request, res: Response) => {
        this.logger.info("/healthz initiated");
        res.send("ok");
      });
  }


  stop = async (): Promise<void> => {
    await this.app.stop();
  };

  start = async (): Promise<void> => {
    try {
      await this.app.start();
      this.logger.info("Add signal handlers");
      const signals: Array<Signals> = ["SIGINT", "SIGTERM"];

      process.on("uncaughtException", async (err) => {
        this.logger.error(
          `An uncaught exception occurred ${formatError(
            err
          )}. Note: This should never happen, please fix this!`
        );
        await this.stop();
      });

      process.on("unhandledRejection", async (err) => {
        this.logger.error(
          `An uncaught rejection occurred ${inspect(
            err
          )}. Note: This should never happen, please fix this!`
        );
        await this.stop();
      });

      signals.forEach((signal: Signals) => {
        process.on(signal, async () => {
          this.logger.debug("Process is being terminated!");
          await this.stop();
        });
      });

    } catch (err) {
      this.logger.error(`Server could not be started ${formatError(err)}`);
      await this.stop();
    }
  };
}
