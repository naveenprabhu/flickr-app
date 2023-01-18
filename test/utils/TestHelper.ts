import { IApplicationConfig } from "../../src/interfaces/IConfig";
import { IFlickrHttpHeaders } from "../../src/interfaces/IHeaders";

export const waitAsync = (timeout: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
};

export const getPhotoSearchRequestHeaders = async (): Promise<IFlickrHttpHeaders> => {
  return {
    "x-request-id": "pcr-0",
    "x-correlation-id": "5e7ba7a8-96b4-11ed-a8fc-0242ac120002",
		"x-client": "web",
    authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImpuRFdLaEk2QlJCOGFzazAwZFBzViJ9.eyJpc3MiOiJodHRwczovL2Rldi1jYml6dTR6cXcydmxocXZoLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJ5OVhEbDdKWW1WYVVVNzA4WXdRWUZsc3pkY3BHcmlud0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hYmJ5bmF2LmNvbSIsImlhdCI6MTY3Mzk1ODgxOCwiZXhwIjoxNjc2NTUwODE4LCJhenAiOiJ5OVhEbDdKWW1WYVVVNzA4WXdRWUZsc3pkY3BHcmludyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.TJsesZ92K0c-zdq1qlR-pCa4B6fa7yhsnPdQ2Wk6eIR9KlmdLznCWMLMZXBYuMLUwa1mWsSz4Hr-7-uQIlrP-vPxExpU8Gx8kcdl0asyax0yNdOw6BOp8CfvPnb9Jo3hbqUP6dDhxeGJ8h0ISdnA5LzpsHoU2pN_1ET93TDykGJ5XxR3KAzbf_1eS_FcUM4dc5tFTSoxGX88s_v8-OAzgTA-6GKUbQGk86-_kntTO1rLTTf9UnWXJfHuAn3m7q-kl5FkduNSeX6Hh8ibuFkLbCPdlIOdn2Jy8IpOXoDQpjN2F8BakDizvbIPEir25ph85FOQm1Fd6pPcqgh3JxDx2Q`,
  };
};

export const setTestSecrets = (): void => {
  process.env.FLICKR_API_KEY =
    "fb84c1cc066088067f2dffa80859e2ca";
};

export const getTestConfig = (
  key: string,
) => {
  switch (key) {
    case "application":
      return {
        jwksUri: "https://dev-cbizu4zqw2vlhqvh.us.auth0.com/.well-known/jwks.json",
    		flickrEndpoint: "https://www.flickr.com/services/rest",
    		flickrResponseFormat: "json",
    		flickrSearchMethod: "flickr.photos.search",
    		flickrResponseCallbackOption: 1,
    		flickrImageUrl: "https://live.staticflickr.com/",
    		flickrImageSuffix: "w"
      } as IApplicationConfig;
    default:
      // Return actual value for all but above
      return jest.requireActual("config").get(key);
  }
};