export interface IApplicationConfig {
  jwksUri: string;
  flickrEndpoint: string;
  flickrSearchMethod: string;
  flickrResponseFormat: string;
  flickrResponseCallbackOption: number;
  flickrImageUrl: string;
  flickrImageSuffix: string;
}

export interface IApiConfig {
  port: number;
}