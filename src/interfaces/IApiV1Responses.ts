export interface IHttpError {
  errorCode: number;
  errorMessage: string;
}

export interface IHTTPErrorWithCorrelationId extends IHttpError {
  correlationId: string;
}

export interface IGetFlickrPhotoRetrieveSuccessResponse {
  correlationId: string;
  photoUrls: string[];
}