import { apiClient } from "./api";

const __finalizeRequest = async (func, errorMessage) => {
  return func
    .then((response) => {
      //console.log(response);
      return response?.data;
    })
    .catch((error) => {
      console.error(errorMessage, error);
      throw error;
    });
};

export const GET = async (url, errorMessage) => {
  return __finalizeRequest(apiClient.get(url), errorMessage);
};

export const POST = async (url, body, errorMessage, headers = {}) => {
  return __finalizeRequest(
    apiClient.post(url, body, { headers }),
    errorMessage
  );
};
export const DELETE = async (url, body, errorMessage) => {
  return __finalizeRequest(apiClient.delete(url, body), errorMessage);
};
