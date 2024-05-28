import { axiosInstance } from ".";
const DOMAIN_SERVER_NAME = "http://localhost:5000"


// make payment
export const MakePayment = async (token, amount) => {
  try {
    const response = await axiosInstance.post(`${DOMAIN_SERVER_NAME}/api/bookings/make-payment`, {
      token,
      amount,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// book shows
export const BookShowTickets = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `${DOMAIN_SERVER_NAME}/api/bookings/book-show`,
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// get bookings of a user
export const GetBookingsOfUser = async () => {
  try {
    const response = await axiosInstance.get(`${DOMAIN_SERVER_NAME}/api/bookings/get-bookings`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const CheckinBooking = async (payload) => {
  try {
    const response = await axiosInstance.put(`${DOMAIN_SERVER_NAME}/api/bookings/checkin`, payload);
    return response.data;
  }catch (error) {
    return error.response.data;
  }
}