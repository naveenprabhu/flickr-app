import { ObjectSchema } from "@hapi/joi";
import { NextFunction, Request, Response } from "express";
import { getLogger, formatError } from "../../utils/Logging";
import { IHttpError } from "../../interfaces/IApiV1Responses";
import { inspect } from "util";

const logger = getLogger();

export const validationMiddleware =
  (schema: ObjectSchema, property: "body" | "query" | "headers") =>
  (req: Request, res: Response, next: NextFunction): void => {
    logger.debug(
      `Received request in validation middleware for property ${property} ${inspect(
        req[property]
      )}`
    );
    const result = schema.validate(req[property]);
    const { error } = result;

    if (!!error) {
      logger.warn(
        `Bad request was made to ${
          req.path
        } for property ${property} with error ${formatError(error)}`
      );
      logger.debug(
        `Bad request was made for ${property} ${JSON.stringify(
          req[property]
        )} ${formatError(error)}`
      );

      res.status(400).json({
        errorCode: 400,
        errorMessage: "Bad request",
      } as IHttpError);
      return;
    }

    next();
  };
