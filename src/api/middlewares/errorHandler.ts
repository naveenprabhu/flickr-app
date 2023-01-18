import { NextFunction, Request, Response } from "express";
import { HTTPError, HTTPErrorWithCorrelationId } from "../../components/Errors";
import {
  getResponseFromHttpErrorWithCorrelationId,
  getResponseFromHttpError,
  internalServerError,
} from "../../utils/Constants";

export const errorHandlerMiddleware = (
  err: Error | HTTPError | HTTPErrorWithCorrelationId,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HTTPErrorWithCorrelationId) {
    return res
      .status(err.errorCode)
      .json(getResponseFromHttpErrorWithCorrelationId(err));
  }
  if (err instanceof HTTPError) {
    return res.status(err.errorCode).json(getResponseFromHttpError(err));
  }
  return res.status(internalServerError.errorCode).json(internalServerError);
};
