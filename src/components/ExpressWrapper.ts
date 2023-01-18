import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { formatError, getLogger } from "../utils/Logging";
import { bearerAuth } from "../api/middlewares/BearerAuth";
import * as http from "http";
import { promisify } from "util";
import { IRouter } from "../interfaces/IRouter";
import { errorHandlerMiddleware } from "../api/middlewares/errorHandler";

export class ExpressWrapper {
  private logger = getLogger();
  private express: Express;
  private server: http.Server;

  constructor() {
    this.express = this.setupExpress();
    this.server = this.setupHttpServer();
  }

  setupExpress(): Express {
    // Add any non route specific Express middleware here
    const app = express()
      .use(cors())
      .use(bearerAuth)
      .use(express.urlencoded({ extended: true }))
      .use(bodyParser.json());

    this.logger.info("Setup Express");
    return app;
  }

  setupHttpServer(): http.Server {
    const server = http.createServer(this.express);
    server.on("error", (err) => {
      this.logger.warn(formatError(err));
    });
    this.logger.info("Setup HTTP Server");
    return server;
  }

  async start(port: number): Promise<void> {
    await promisify(this.server.listen).bind(this.server)(port);
    const address = this.server.address() as { port: number };
    this.logger.info(`Started HTTP Server on port ${address.port}`);
  }

  async stop(): Promise<void> {
    try {
      await promisify(this.server.close).bind(this.server)();
      this.logger.info("Stopped HTTP Server");
    } catch (err) {
      this.logger.warn(
        `Error when trying to stop HTTP Server ${formatError(err)}`
      );
    }
  }

  addRouters(...routers: IRouter[]): void {
    for (const router of routers) {
      this.express.use(router.getPrefix(), router.getRouter());
    }
    this.express
      .use((req: Request, res: Response) => {
        res.status(404).json({
          errorCode: 404,
          errorMessage: "Not found",
        });
      })
      .use(errorHandlerMiddleware);
  }
}
