import { IncomingHttpHeaders } from "http";

export const getErrorMessage = (
  errorCode: number,
  errorMessage: string
): { errorCode: number; errorMessage: string; correlationId: string } => {
  return {
    errorCode,
    errorMessage,
    correlationId: "cor-123",
  };
};

export const checkEnv = (): void => {
  for (const envVar of [
    "FLICKR_API_KEY",
  ]) {
    if (!process.env[envVar]) {
      throw new Error(`Missing environment variable ${envVar}`);
    }
  }
};

export const transformHeaders = (headers: IncomingHttpHeaders) => {
  const correlationIdRaw = headers["x-correlation-id"] ?? "";
  let correlationIdHeader = "";

  if (
    typeof correlationIdRaw === "string" ||
    correlationIdRaw instanceof String
  ) {
    correlationIdHeader = correlationIdRaw as string;
  } else {
    correlationIdHeader = correlationIdRaw[0] as string;
  }

  return {
    correlationId: correlationIdHeader,
  };
};
