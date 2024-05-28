import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Row,
  Col,
  Modal,
  Input,
  message,
  ConfigProvider,
  Button,
} from "antd";
import { ShowLoading, HideLoading } from "../../redux/loadersSlice.js";
import { ChangePassword, UpdateUser } from "../../api/users.js";

const ProfileDetail = () => {
  const { user } = useSelector((state) => state.users);
  const [edit, setEdit] = useState(false);
  const dispatch = useDispatch();
  const [changePassword, setChangePassword] = useState(false);

  const onFinishEdit = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await UpdateUser(values);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const onFinishChangePassword = async (values) => {
    const { oldPassword, newPassword } = values;
    try {
      dispatch(ShowLoading());
      const response = await ChangePassword({
        password: oldPassword,
        newPassword: newPassword,
      });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        setTimeout(() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }, 2000);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const validatePassword = (_, value) => {
    if (!value) return Promise.resolve();
    const lowercaseRegex = /(?=.*[a-z])/;
    const uppercaseRegex = /(?=.*[A-Z])/;
    const specialCharRegex = /(?=.*[!@#$%^&*])/;
    const numberRegex = /(?=.*\d)/;

    if (
      !lowercaseRegex.test(value) ||
      !uppercaseRegex.test(value) ||
      !specialCharRegex.test(value) ||
      !numberRegex.test(value) 
    ) {
      return Promise.reject(
        new Error(
          "Mật khẩu phải bao gồm ít nhất một ký tự thường, một ký tự in hoa và một ký tự đặc biệt!"
        )
      );
    }

    return Promise.resolve();
  };

  return (
    <div className="w-700">
      <Form layout="vertical" initialValues={user}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Name" name="name">
              <input type="text" disabled></input>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Email" name="email">
              <input type="text" disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Số điện thoại" name="phone">
              <input type="text" disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Địa chỉ" name="address">
              <input type="text" disabled />
            </Form.Item>
          </Col>
        </Row>
        <div className="flex justify-end gap-1">
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
            <Button
              type="primary"
              onClick={() => setEdit(true)}
              style={{ height: "40px" }}
            >
              Chỉnh sửa
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
            <Button
              type="primary"
              onClick={() => setChangePassword(true)}
              style={{ height: "40px" }}
            >
              Đổi mật khẩu
            </Button>
          </ConfigProvider>
        </div>
      </Form>

      {edit && (
        <Modal
          open={edit}
          title="CHỈNH SỬA THÔNG TIN"
          onCancel={() => setEdit(false)}
          footer={null}
        >
          <Form layout="vertical" initialValues={user} onFinish={onFinishEdit}>
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[
                { required: true, message: "Hãy nhập số điện thoại!" },
                { whitespace: true },
              ]}
              hasFeedback
            >
              <Input placeholder="Họ và tên" />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Hãy nhập số điện thoại!" },
                { len: 10, message: "Số điện thoại phải có đúng 10 chữ số!" },
                {
                  pattern: /^[0-9]+$/,
                  message: "Số điện thoại chỉ được chứa chữ số!",
                },
              ]}
              hasFeedback
            >
              <Input placeholder="Số điện thoại" />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Hãy nhập địa chỉ!" }]}
              hasFeedback
            >
              <Input placeholder="Địa chỉ" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Hãy nhập email!" },
                {
                  type: "email",
                  message: "Hãy nhập đúng định dạng user@gmail.com!",
                },
              ]}
              hasFeedback
            >
              <Input placeholder="Email"></Input>
            </Form.Item>
            <div className="flex justify-center gap-1 mt-2">
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
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ height: "40px", width: "100%" }}
                >
                  Cập nhật
                </Button>
              </ConfigProvider>
            </div>
          </Form>
        </Modal>
      )}

      {changePassword && (
        <Modal
          open={changePassword}
          title="ĐỔI MẬT KHẨU"
          onCancel={() => {
            setChangePassword(false);
          }}
          footer={null}
        >
          <Form layout="vertical" onFinish={onFinishChangePassword}>
            <Form.Item
              label="Mật khẩu cũ"
              name="oldPassword"
              rules={[{ required: true, message: "Hãy nhập mật khẩu!" }]}
              hasFeedback
            >
              <Input.Password placeholder="Nhập mật khẩu cũ" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              rules={[
                { required: true, message: "Hãy nhập mật khẩu!" },
                { min: 6, message: "Mật khẩu gồm ít nhất 6 ký tự!"},
                { validator: validatePassword },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>
            <Form.Item
              label="Nhập lại mật khẩu"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Hãy nhập lại mật khẩu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Mật khẩu không khớp. Hãy nhập lại!");
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Nhập lại mật khẩu" />
            </Form.Item>
            <div className="flex justify-center gap-1 mt-2">
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
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ height: "40px", width: "100%" }}
                >
                  Xác nhận
                </Button>
              </ConfigProvider>
            </div>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default ProfileDetail;
