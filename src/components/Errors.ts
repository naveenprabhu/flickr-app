import {
  IHttpError,
  IHTTPErrorWithCorrelationId,
} from "../interfaces/IApiV1Responses";

export class HTTPError extends Error implements IHttpError {
  errorCode: number;
  errorMessage: string;
  constructor({ errorCode, errorMessage }: IHttpError) {
    super(
      `Error occurred, status code to send is '${errorCode}', status message to send is '${errorMessage}'`
    );
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
  }
}

export class HTTPErrorWithCorrelationId
  extends HTTPError
  implements IHTTPErrorWithCorrelationId
{
  correlationId: string;
  constructor({
    errorCode,
    errorMessage,
    correlationId,
  }: IHTTPErrorWithCorrelationId) {
    super({ errorCode, errorMessage });
    this.correlationId = correlationId;
  }
}
