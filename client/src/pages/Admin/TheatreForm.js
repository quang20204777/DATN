import React from "react";
import { Divider, Form, message, Modal, Button, ConfigProvider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AddTheatre, UpdateTheatre } from "../../api/theatres";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";

const TheatreForm = ({
  showTheatreFormModal,
  setShowTheatreFormModal,
  formType,
  setFormType,
  selectedTheatre,
  setSelectedTheatre,
  getData,
}) => {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response = null;
      if (formType === "add") {
        response = await AddTheatre(values);
      } else {
        values.theatreId = selectedTheatre._id;
        response = await UpdateTheatre(values);
      }

      if (response.success) {
        message.success(response.message);
        setShowTheatreFormModal(false);
        setSelectedTheatre(null);
        getData();
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
    <Modal
      title={formType === "add" ? "Thêm rạp chiếu" : "Chỉnh sửa rạp chiếu"}
      open={showTheatreFormModal}
      onCancel={() => {
        setShowTheatreFormModal(false);
        setSelectedTheatre(null);
      }}
      footer={null}
    >
      <Divider style={{ margin: "5px" }} />
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={formType === "add" ? null: selectedTheatre}
      >
        <Form.Item
          label="Tên rạp chiếu"
          name="name"
          rules={[{ required: true, message: "Please input theatre name!" }]}
        >
          <input type="text" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Please input theatre address!" }]}
        >
          <textarea type="text" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Please input theatre phone number!" },
          ]}
        >
          <input type="text" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input theatre email!" }]}
        >
          <input type="text" />
        </Form.Item>
        <div className="flex justify-end gap-1">
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimary: `linear-gradient(135deg, rgba(128, 128, 128, 1), rgba(128, 128, 128, 0.6))`,
                  colorPrimaryHover: `linear-gradient(135deg, rgba(128, 128, 128, 1), rgba(128, 128, 128, 0.8))`,
                  colorPrimaryActive: `linear-gradient(135deg, rgba(128, 128, 128, 1), rgba(128, 128, 128, 1))`,
                  lineWidth: 0,
                },
              },
            }}
          >
            <Button
              type="primary"
              onClick={() => {
                setShowTheatreFormModal(false);
                setSelectedTheatre(null);
              }}
            >
              Hủy
            </Button>
          </ConfigProvider>

          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimary: `linear-gradient(135deg, #002E2A, #00B3A4);`,
                  colorPrimaryHover: `linear-gradient(135deg, #004241, #00C6C0)`,
                  colorPrimaryActive: `linear-gradient(135deg, #001D1A, #008776)`,
                  lineWidth: 0,
                },
              },
            }}
          >
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </ConfigProvider>
        </div>
      </Form>
    </Modal>
  );
};

export default TheatreForm;
