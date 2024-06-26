const { axiosInstance } = require(".");
const DOMAIN_SERVER_NAME = "http://localhost:5000";

// Register
export const RegisterUser = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${DOMAIN_SERVER_NAME}/api/users/register`,
      payload
    );
    return response.data;
  } catch (error) {
    return error.response;
  }
};

//Login
export const LoginUser = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${DOMAIN_SERVER_NAME}/api/users/login`,
      payload
    );
    return response.data;
  } catch (error) {
    return error.response;
  }
};

//Quên mật khẩu
export const ForgotPasswordAPI = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${DOMAIN_SERVER_NAME}/api/users/forgot-password`,
      payload
    );
    return response.data;
  } catch (error) {
    return error.response;
  }
};

//Reset mật khẩu
export const ResetPassWord = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${DOMAIN_SERVER_NAME}/api/users/reset-password`,
      payload
    );
    return response.data;
  } catch (error) {
    return error.response;
  }
};

//Get current user
export const GetCurrentUser = async () => {
  try {
    const response = await axiosInstance.get(
      `${DOMAIN_SERVER_NAME}/api/users/get-current-user`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//Change Password
export const ChangePassword = async (payload) => {
try {
  const response = await axiosInstance.put(
    `${DOMAIN_SERVER_NAME}/api/users/change-password`,
    payload
  )
  return response.data;
}catch (error) {
  return error;
}
}

//Update user
export const UpdateUser = async (payload) => {
  try {
    const response = await axiosInstance.put(
      `${DOMAIN_SERVER_NAME}/api/users/update-current-user`,
      payload
    )
    return response.data;
  }catch (error) {
    return error;
  }
}

export const UploadImage = async (file) => {
  try {
    const formData = new FormData()
    formData.append("quangimage", file)
    const response = await axiosInstance.post(
      `${DOMAIN_SERVER_NAME}/api/users/uploadimage`,
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

export const GetAllUsers = async () => {
  try {
      const response = await axiosInstance.get(`${DOMAIN_SERVER_NAME}/api/users/get-all-users`);
      return response.data;
  } catch (error) {
      return error.response;
  }
}

export const DeleteUser = async (payload) => {
  try {
      const response = await axiosInstance.post(`${DOMAIN_SERVER_NAME}/api/users/delete-user`, payload);
      return response.data;
  } catch (error) {
      return error.response;
  }
}
