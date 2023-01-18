import {
  IHttpError,
  IHTTPErrorWithCorrelationId,
} from "../interfaces/IApiV1Responses";
import { HTTPError, HTTPErrorWithCorrelationId } from "../components/Errors";

export const unathorizedError: IHttpError = {
  errorCode: 401,
  errorMessage: "Unauthorized error occured",
};
export const badRequest: IHttpError = {
  errorCode: 400,
  errorMessage: "Bad request",
};
export const timeoutError: IHttpError = {
  errorCode: 408,
  errorMessage: "Timeout, the transaction hasn't completed yet, please retry",
};
export const transactionNotFoundError: IHttpError = {
  errorCode: 404,
  errorMessage: "Transaction not found",
};
export const internalServerError: IHttpError = {
  errorCode: 500,
  errorMessage: "An internal server error occurred",
};
export const serviceUnavailableError: IHttpError = {
  errorCode: 503,
  errorMessage: "Service unavailable",
};
export const getResponseFromHttpError = (error: HTTPError): IHttpError => {
  return {
    errorCode: error.errorCode,
    errorMessage: error.errorMessage,
  };
};
export const getResponseFromHttpErrorWithCorrelationId = (
  error: HTTPErrorWithCorrelationId
): IHTTPErrorWithCorrelationId => {
  return {
    errorCode: error.errorCode,
    errorMessage: error.errorMessage,
    correlationId: error.correlationId,
  };
};
