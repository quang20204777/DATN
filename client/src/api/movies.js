const { axiosInstance } = require(".");
const DOMAIN_SERVER_NAME = "http://localhost:5000"


// Add a new movie
export const AddMovie = async (payload) => {
    try {
        const response = await axiosInstance.post(`${DOMAIN_SERVER_NAME}/api/movies/add-movie`, payload);
        return response.data;
    } catch (error) {
        return error.response;
    }
}

// get all movies
export const GetAllMovies = async () => {
    try {
        const response = await axiosInstance.get(`${DOMAIN_SERVER_NAME}/api/movies/get-all-movies`);
        return response.data;
    } catch (error) {
        return error.response;
    }
}

// update a movie
export const UpdateMovie = async (payload) => {
    try {
        const response = await axiosInstance.post(`${DOMAIN_SERVER_NAME}/api/movies/update-movie`, payload);
        return response.data;
    } catch (error) {
        return error.response;
    }
}

// delete a movie
export const DeleteMovie = async (payload) => {
    try {
        const response = await axiosInstance.post(`${DOMAIN_SERVER_NAME}/api/movies/delete-movie`, payload);
        return response.data;
    } catch (error) {
        return error.response;
    }
}

// get a movie by id
export const GetMovieById = async (id) => {
    try {
        const response = await axiosInstance.get(`${DOMAIN_SERVER_NAME}/api/movies/get-movie-by-id/${id}`);
        return response.data;
    } catch (error) {
        return error.response;
    }
}

//get all movie now showing
export const GetMovieNowShowing = async () => {
    try {
        const response = await axiosInstance.get(`${DOMAIN_SERVER_NAME}/api/movies/now-playing`);
        return response.data;
    } catch (error) {
        return error.response;
    }
}

export const GetMovieComingSoon = async () => {
    try {
        const response = await axiosInstance.get(`${DOMAIN_SERVER_NAME}/api/movies/coming-soon`);
        return response.data;
    } catch (error) {
        return error.response;
    }
}

export const uploadImage = async (image) => {
    try {
      const formData = new FormData()
      formData.append("quangimage", image)
      const response = await axiosInstance.post(
        `${DOMAIN_SERVER_NAME}/image/uploadimage`,
        formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
    return response.data;
    } catch (error) {
      return error.response;
    }
  };