import { IGetFlickrPhotoRetrieveSuccessResponse } from "../../src/interfaces/IApiV1Responses";
import { IFlickrPhotoResponse, Photo } from "../../src/interfaces/IFlickrResponse";

export const getPhotoSearchFlickrResponse = (): IFlickrPhotoResponse => {
  return {
    photos: {
      page: 1,
      total: 200,
      photo: getPhotos()
    },
    stat: "ok"  
  };
};

export const getPhotos = (): Photo[] => {
  return [
    {
      id: "52632097077",
      owner: "94960413",
      secret: "b5269b4774",
      server: "65535",
      farm: 66,
      title: "COVER",
      ispublic: 1,
      isfriend: 0,
      isfamily: 0
    },
    {
      id: "52632097078",
      owner: "94960413",
      secret: "f53d7890c3",
      server: "65535",
      farm: 66,
      title: "COVER",
      ispublic: 1,
      isfriend: 0,
      isfamily: 0
    },
    {
      id: "52632097079",
      owner: "94960413",
      secret: "1e5cc36bac",
      server: "65535",
      farm: 66,
      title: "COVER",
      ispublic: 1,
      isfriend: 0,
      isfamily: 0
    },
    {
      id: "52632097080",
      owner: "94960413",
      secret: "929164d086",
      server: "65535",
      farm: 66,
      title: "COVER",
      ispublic: 1,
      isfriend: 0,
      isfamily: 0
    }
  ]
};

export const getPhotosRetrieveResponse = (): IGetFlickrPhotoRetrieveSuccessResponse => {

	return {
    "correlationId": "5e7ba7a8-96b4-11ed-a8fc-0242ac120002",
    "photoUrls": [
        "https://live.staticflickr.com/65535/52632097077_b5269b4774_w.jpg",
        "https://live.staticflickr.com/65535/52632097078_f53d7890c3_w.jpg",
        "https://live.staticflickr.com/65535/52632097079_1e5cc36bac_w.jpg",
        "https://live.staticflickr.com/65535/52632097080_929164d086_w.jpg"
    ]
}

}