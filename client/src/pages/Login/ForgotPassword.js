import React, { useEffect, useState } from "react";
import { Col, Form, Input, Row, message, ConfigProvider, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ForgotPasswordAPI, ResetPassWord } from "../../api/users.js";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice.js";

function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const onFinish = async (values) => {
    const { email, otp, newPassword } = values;
    try {
      dispatch(ShowLoading());
      const response = await ResetPassWord({
        email: email,
        otp: otp,
        newPassword: newPassword,
      });
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

  const sendOTP = async (e) => {
    e.preventDefault();
    try {
      dispatch(ShowLoading());
      const values = await form.validateFields(["email"]);
      const response = await ForgotPasswordAPI({ email: values.email });
      if (response.success) {
        setVisible(true);
        dispatch(HideLoading());
      } else {
        message.error(response.message);
        dispatch(HideLoading());
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);
  return (
    <div
      style={{
        backgroundImage: 'url("./hust_background.png")',
        backgroundSize: "cover",
        width: "100%",
        height: "100vh",
      }}
    >
      <div
        className="flex justify-center h-screen items-center "
        style={{
          backgroundColor: "rgba(0,0,0,0.6)",
          width: "100%",
          height: "100vh",
        }}
      >
        <div className="card w-400 p-3">
          <h1 className="text-xl mb-1">MOVIES - QUÊN MẬT KHẨU </h1>
          <hr />
          <Form
            form={form}
            layout="vertical"
            className="mt-1"
            onFinish={onFinish}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập email!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Nhập Email" />
                </Form.Item>
              </Col>
              {!visible && (
                <Col
                  span={6}
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    paddingBottom: "10px",
                  }}
                >
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
                    <Button type="primary" onClick={sendOTP}>
                      Gửi
                    </Button>
                  </ConfigProvider>
                </Col>
              )}
            </Row>
            {visible && (
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="OTP"
                    name="otp"
                    rules={[
                      { required: true, message: "Hãy nhập otp!" },
                      { len: 6, message: "Mã OTP phải có đúng 6 chữ số!" },
                      {
                        pattern: /^[0-9]+$/,
                        message: "OTP chỉ được chứa chữ số!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input placeholder="Nhập OTP" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[
                      { required: true, message: "Vui lòng nhập mật khẩu!" },
                    ]}
                    hasFeedback
                  >
                    <Input.Password placeholder="Nhập mật khẩu" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Nhập lại mật khẩu"
                    name="confirmPassword"
                    dependencies={["newPassword"]}
                    rules={[
                      { required: true, message: "Hãy nhập lại mật khẩu!" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue("newPassword") === value
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            "Mật khẩu không khớp. Hãy nhập lại!"
                          );
                        },
                      }),
                    ]}
                    hasFeedback
                  >
                    <Input.Password placeholder="Nhập lại mật khẩu" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <div className="flex flex-col mt-2 mb-2 gap-1">
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
                      <Button type="primary" htmlType="submit" style={{height: "40px"}}>
                        Khôi phục mật khẩu
                      </Button>
                    </ConfigProvider>
                  </div>
                </Col>
              </Row>
            )}
            <div>
              <span>
                {" "}
                Quay lại trang&nbsp;
                <Link to="/login" className="text-third">
                  Đăng nhập
                </Link>
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
