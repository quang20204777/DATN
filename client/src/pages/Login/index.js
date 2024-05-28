import React, { useEffect } from "react";
import { Form, Input, message, ConfigProvider, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../../api/users.js";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice.js";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await LoginUser(values);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        message.error(response.message);
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
        className="flex justify-center h-screen items-center"
        style={{
          backgroundColor: "rgba(0,0,0,0.6)",
          width: "100%",
          height: "100vh",
        }}
      >
        <div className="card w-400 p-3">
          <h1 className="text-xl mb-1">MOVIES - ĐĂNG NHẬP </h1>
          <hr />
          <Form layout="vertical" className="mt-1" onFinish={onFinish}>
            <Form.Item
              label="Email hoặc Số điện thoại"
              name="emailOrPhone"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email hoặc số điện thoại!",
                },
              ]}
            >
              <Input placeholder="Nhập Email hoặc Số điện thoại" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            <div className="flex flex-col mt-2 gap-1">
              <span>
                <Link to="/forgotPassword" className="text-third">
                  Quên mật khẩu?
                </Link>
              </span>
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
                  Đăng nhập
                </Button>
              </ConfigProvider>
              <span>
                {"Bạn chưa có tài khoản? "}
                <Link to="/register" className="text-third">
                  Đăng ký
                </Link>
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
