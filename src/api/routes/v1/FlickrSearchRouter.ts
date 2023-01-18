import { NextFunction, Request, Response, Router } from "express";
import { HTTPError } from "../../../components/Errors";
import { IRouter } from "../../../interfaces/IRouter";
import { internalServerError } from "../../../utils/Constants";
import { transformHeaders } from "../../../utils/Helpers";
import { formatError, getLogger } from "../../../utils/Logging";
import { validationMiddleware } from "../../middlewares/validation";
import {
  GetRequestHeadersSchema,
} from "../../schemas/FlickrSearchSchema";
import { FlickrSearchService } from "../../services/FlickrSearchServices";

export class FlickrSearchRouter implements IRouter {
  private readonly logger = getLogger();
  private readonly router: Router;
  private readonly prefix = "/v1";

  constructor(private readonly searchService: FlickrSearchService) {
    this.router = this.setupRoutes();
  }

  setupRoutes(): Router {
    return Router()
      .get(
        "/photos",
        validationMiddleware(GetRequestHeadersSchema, "headers"),
        async (req: Request, res: Response, next: NextFunction) => {
          const searchTag: string  = req.query.searchTag as string;
          const correlationId = transformHeaders(req.headers)
            .correlationId as string;
          this.logger.info(
            `Received request in GET ${req.path} with tag ${searchTag}`
          );

          try {
            const result = await this.searchService.handleGetPhotos(
                searchTag,
                correlationId
            );
            if (!result) {
              this.logger.warn(
                `Received empty result in GET ${req.path} from handleGetPhotos for tag ${searchTag}`
              );
              throw new HTTPError(internalServerError);
            }
            this.logger.info(
              `Responding to client in GET ${req.path} for correlationId ${correlationId} and tag ${searchTag}`
            );
            res.status(200).json(result);
          } catch (err) {
            this.logger.warn(
              `An error occurred in GET ${
                req.path
              } when trying to get photos ${formatError(
                err
              )} for tag ${searchTag}`
            );
            return next(err);
          }
        }
      )
  }

  getPrefix(): string {
    return this.prefix;
  }

  getRouter(): Router {
    return this.router;
  }
}
