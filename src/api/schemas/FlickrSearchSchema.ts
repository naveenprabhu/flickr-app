import Joi from "@hapi/joi";

export const GetRequestHeadersSchema = Joi.object({
    "x-request-id": Joi.string(),
    "x-correlation-id": Joi.string().required(),
    "x-client": Joi.string().required(),
  }).options({ allowUnknown: true });