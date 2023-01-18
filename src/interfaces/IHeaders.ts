// IHeaders.ts
import { IncomingHttpHeaders } from "http2";

export interface IFlickrHttpHeaders extends IncomingHttpHeaders {
  "x-request-id"?: string;
  "x-correlation-id"?: string;
  "x-client"?: string;
}
