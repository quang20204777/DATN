import { axiosInstance } from ".";
const DOMAIN_SERVER_NAME = "http://localhost:5000"

// Add a new theatre
export const AddTheatre = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${DOMAIN_SERVER_NAME}/api/theatres/add-theatre`,
      payload
    );
    return response.data;
  } catch (error) {
    return error.response;
  }
};

// get all theatres
export const GetAllTheatres = async () => {
  try {
    const response = await axiosInstance.get(`${DOMAIN_SERVER_NAME}/api/theatres/get-all-theatres`);
    return response.data;
  } catch (error) {
    return error.response;
  }
};


export const UpdateTheatre = async (payload) => {
  try {
    const response = await axiosInstance.put(
      `${DOMAIN_SERVER_NAME}/api/theatres/update-theatre`,
      payload
    );
    return response.data;
  } catch (error) {
    return error.response;
  }
};

// delete theatre
export const DeleteTheatre = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${DOMAIN_SERVER_NAME}/api/theatres/delete-theatre`,
      payload
    );
    return response.data;
  } catch (error) {
    return error.response;
  }
};

// add show
export const AddShow = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${DOMAIN_SERVER_NAME}/api/theatres/add-show`,
      payload
    );
    return response.data;
  } catch (error) {
    return error.response;
  }
};

// get all shows
export const GetAllShowsByTheatre = async (payload) => {
  console.log(payload);
  try {
    const response = await axiosInstance.post(
      `${DOMAIN_SERVER_NAME}/api/theatres/get-all-shows-by-theatre`,
      payload
    );
    return response.data;
  } catch (error) {
    return error.response;
  }
};

// delete show
export const DeleteShow = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${DOMAIN_SERVER_NAME}/api/theatres/delete-show`,
      payload
    );
    return response.data;
  } catch (error) {
    return error.response;
  }
};

// get all theatres for a movie
export const GetAllTheatresByMovie = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${DOMAIN_SERVER_NAME}/api/theatres/get-all-theatres-by-movie`,
      payload
    );
    return response.data;
  } catch (error) {
    return error.response;
  }
};


// get show by id
export const GetShowById = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${DOMAIN_SERVER_NAME}/api/theatres/get-show-by-id`,
      payload
    );
    return response.data;
  } catch (error) {
    return error.response;
  }
}