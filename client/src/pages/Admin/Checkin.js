import { Form, message, ConfigProvider, Button } from "antd";
import React from "react";
import { CheckinBooking } from "../../api/bookings.js";
import { ShowLoading, HideLoading } from "../../redux/loadersSlice.js";
import { useDispatch } from "react-redux";

const Checkin = () => {
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await CheckinBooking(values);
      if (response.success) {
        message.success(response.message);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <div className="flex justify-center card">
      <Form
        style={{ paddingTop: "10px", paddingLeft: "10px", width: "50%" }}
        onFinish={onFinish}
      >
        <Form.Item label="Booking ID" name="bookingId">
          <input placeholder="booking id"></input>
        </Form.Item>
        <Form.Item className="flex justify-center">
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimary: `linear-gradient(135deg, rgba(0, 46, 42, 1), rgba(0, 46, 42, 0.6))`,
                  colorPrimaryHover: `linear-gradient(135deg, rgba(0, 46, 42, 1), rgba(0, 46, 42, 0.8))`,
                  colorPrimaryActive: `linear-gradient(135deg, rgba(0, 46, 42, 1), rgba(0, 46, 42, 1))`,
                  lineWidth: 0,
                },
              },
            }}
          >
            <Button type="primary" htmlType="submit">
              Checkin
            </Button>
          </ConfigProvider>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Checkin;
