import React, { useEffect } from "react";
import { Col, Form, Input, Row, message, ConfigProvider, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { RegisterUser } from "../../api/users.js";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice.js";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      const { name, email, password, phone, address } = values;
      dispatch(ShowLoading());
      const response = await RegisterUser({
        name: name,
        email: email,
        password: password,
        phone: phone,
        address: address,
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
        className="flex justify-center h-screen items-center"
        style={{
          backgroundColor: "rgba(0,0,0,0.6)",
          width: "100%",
          height: "100vh",
        }}
      >
        <div className="card w-700 p-3">
          <h1 className="text-xl mb-1">MOVIES - ĐĂNG KÝ </h1>
          <hr />
          <Form layout="vertical" className="mt-1" onFinish={onFinish}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Họ và tên"
                  name="name"
                  rules={[
                    { required: true, message: "Hãy nhập họ và tên!" },
                    { whitespace: true },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Nhập Họ và tên" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    { required: true, message: "Hãy nhập số điện thoại!" },
                    {
                      len: 10,
                      message: "Số điện thoại phải có đúng 10 chữ số!",
                    },
                    {
                      pattern: /^[0-9]+$/,
                      message: "Số điện thoại chỉ được chứa chữ số!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Hãy nhập địa chỉ!" }]}
              hasFeedback
            >
              <Input placeholder="Nhập địa chỉ" />
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
              <Input placeholder="Nhập email"></Input>
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: "Hãy nhập mật khẩu!" },
                    { min: 6, message: "Mật khẩu gồm ít nhất 6 ký tự!" },
                    { validator: validatePassword },
                  ]}
                  hasFeedback
                >
                  <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Nhập lại mật khẩu"
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Hãy nhập lại mật khẩu!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
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
            </Row>

            <div className="flex flex-col mt-2 gap-1">
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
                  style={{ height: "40px" }}
                >
                  Đăng ký
                </Button>
              </ConfigProvider>
              <span>
                {" "}
                Bạn đã có tài khoản?&nbsp;
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

export default Register;
