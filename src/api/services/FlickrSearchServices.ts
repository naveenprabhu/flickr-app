import config from "config";
import { IGetFlickrPhotoRetrieveSuccessResponse } from "../../interfaces/IApiV1Responses";
import { IApplicationConfig } from "../../interfaces/IConfig";
import { getLogger } from "../../utils/Logging";
import axios, { AxiosResponse } from 'axios';
import { IFlickrPhotoResponse } from "../../interfaces/IFlickrResponse";


export class FlickrSearchService {
  private logger = getLogger();
  private appConfig: IApplicationConfig = config.get("application");

  async handleGetPhotos(
    searchTag: string,
    correlationId: string
  ): Promise<IGetFlickrPhotoRetrieveSuccessResponse> {

    let baseUrl = `${this.appConfig.flickrEndpoint}`;
    this.logger.debug(`Request URL is ${baseUrl}`);
    try {
      const rawResponse: AxiosResponse<IFlickrPhotoResponse> = await axios.get(baseUrl, {
        params: {
            method: `${this.appConfig.flickrSearchMethod}`,
            api_key: process.env.FLICKR_API_KEY,
            tags: searchTag,
            format: `${this.appConfig.flickrResponseFormat}`,
            nojsoncallback: `${this.appConfig.flickrResponseCallbackOption}`
        }
      });
      const flickrResponse = rawResponse.data;
      this.logger.info(`Request with correlationId ${correlationId} returned response ${flickrResponse}`);
      const photoUrls = flickrResponse.photos.photo.map( photo => {
        return `${this.appConfig.flickrImageUrl}${photo.server}/${photo.id}_${photo.secret}_${this.appConfig.flickrImageSuffix}.jpg`
      })
      const response: IGetFlickrPhotoRetrieveSuccessResponse = {
        correlationId,
        photoUrls
      }
      return response;
    } catch (error) {
      this.logger.error(`The request with correlationId ${correlationId} returned error ${error}`);
      throw error;
    }
  }
}