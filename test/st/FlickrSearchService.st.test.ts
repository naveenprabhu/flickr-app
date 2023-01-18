/* eslint prefer-destructuring: 0 */

const mockConfigGet = jest.fn();
jest.mock("config", () => {
  return {
    get: mockConfigGet,
  };
});

import request from "supertest";
import { IHttpError } from "../../src/interfaces/IApiV1Responses";
import { Server } from "../../src/Server";
import { getPhotoSearchRequestHeaders, getTestConfig, setTestSecrets, waitAsync } from "../utils/TestHelper";
const serverUrl = "http://localhost:4993/";

describe("FlickrSearchServiceE2E", () => {
	let server: Server;

	beforeEach(async () => {
		setTestSecrets();
    jest.clearAllMocks();
    jest.resetAllMocks();
		mockConfigGet.mockImplementation((key: string) => {
      return getTestConfig(key);
    });
    server = new Server();
    await server.start();
    await waitAsync(2000);
  }, 25000);

	afterEach(async () => {
    await server.stop();
  }, 25000);

	it("Should return 400 when incorrect headers are sent", async () => {
		const headers = await getPhotoSearchRequestHeaders();
		delete headers["x-client"];

		await request(serverUrl)
			.get(`v1/photos?searchTag=paris`)
			.set(headers)
			.expect(400, {
				errorCode: 400,
				errorMessage: "Bad request",
			} as IHttpError);
	}, 25000);

	it("Should return 200 success resonse when searched by tag", async() => {
		const headers = await getPhotoSearchRequestHeaders();
		await request(serverUrl)
		.get(`v1/photos?searchTag=paris`)
		.set(headers)
		.then((response) => {
			expect(response.status).toEqual(200);
			expect(response.body.correlationId).toEqual("5e7ba7a8-96b4-11ed-a8fc-0242ac120002");
			expect(response.body.photoUrls).toContain("https://live.staticflickr.com/65535/52633271972_ce6e7b2945_w.jpg");
		});
	});
});
