import config from "config";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { IApplicationConfig } from "../../interfaces/IConfig";
import { FlickrSearchService } from './FlickrSearchServices'
import { getPhotoSearchFlickrResponse, getPhotosRetrieveResponse } from '../../../test/utils/TestData'

describe("FlickrSearchService", () => {
  let appConfig: IApplicationConfig = config.get("application");
  let getFlickrSearchService = () => {
    return new FlickrSearchService()
  };  

  describe("handleGetPhotos", () => {  

    let service: FlickrSearchService =  getFlickrSearchService();
		let mock = new MockAdapter(axios);

		beforeEach(() => {
			mock.reset();
			jest.clearAllMocks();
		})

    it("Should invoke flickr api successfully for searching photos", () => {
      const flickrResponse = getPhotoSearchFlickrResponse();
      mock.onGet(`${appConfig.flickrEndpoint}?method=${appConfig.flickrSearchMethod}&api_key=123&tags=paris&format=${appConfig.flickrResponseFormat}&nojsoncallback=${appConfig.flickrResponseCallbackOption}`)
      	.reply(200, flickrResponse);
			
			service.handleGetPhotos('paris', '0cc9cb08-9676-11ed-a1eb-0242ac120002')
				.then(response => {
					expect(response).toEqual(flickrResponse);
				});
    });

		it("Should invoke flickr api successfuly and convert the response", async () => {
      const flickrResponse = getPhotoSearchFlickrResponse();
			const searchTag = 'paris';
			const expectedPhotosRetrieveSuccessResponse = getPhotosRetrieveResponse();
      mock.onGet(`${appConfig.flickrEndpoint}`, {
				params: {
					method: `${appConfig.flickrSearchMethod}`,
          api_key: process.env.FLICKR_API_KEY,
          tags: searchTag,
          format: `${appConfig.flickrResponseFormat}`,
          nojsoncallback: `${appConfig.flickrResponseCallbackOption}`
				}
			}).reply(200, flickrResponse);
			
			const response =  await service.handleGetPhotos(searchTag, '5e7ba7a8-96b4-11ed-a8fc-0242ac120002');

			expect(response).toEqual(expectedPhotosRetrieveSuccessResponse);
    });

		it("Should flickr api call timeout and throw an error", async () => {
			const searchTag = 'paris';
			mock.onGet(`${appConfig.flickrEndpoint}`, {
				params: {
					method: `${appConfig.flickrSearchMethod}`,
          api_key: process.env.FLICKR_API_KEY,
          tags: searchTag,
          format: `${appConfig.flickrResponseFormat}`,
          nojsoncallback: `${appConfig.flickrResponseCallbackOption}`
				}
			}).timeout();
			
			await expect(
				service.handleGetPhotos(searchTag, '5e7ba7a8-96b4-11ed-a8fc-0242ac120002')
			).rejects.toThrow(
				`timeout of 0ms exceeded`
			);
		});

		it("Should flickr api call respond back with 500 error and throw error", async () => {
			const searchTag = 'paris';
			mock.onGet(`${appConfig.flickrEndpoint}`, {
				params: {
					method: `${appConfig.flickrSearchMethod}`,
          api_key: process.env.FLICKR_API_KEY,
          tags: searchTag,
          format: `${appConfig.flickrResponseFormat}`,
          nojsoncallback: `${appConfig.flickrResponseCallbackOption}`
				}
			}).reply(500);
			
			await expect(
				service.handleGetPhotos(searchTag, '5e7ba7a8-96b4-11ed-a8fc-0242ac120002')
			).rejects.toThrow(
				'Request failed with status code 500'
			);
		});
  });
});