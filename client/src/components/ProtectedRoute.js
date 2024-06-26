import React, { useEffect } from "react";
import { GetCurrentUser } from "../api/users.js";
import { Avatar, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice.js";
import { HideLoading, ShowLoading } from "../redux/loadersSlice.js";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getCurrentUser = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetCurrentUser();
      dispatch(HideLoading());
      if (response.success) {
        dispatch(SetUser(response.data));
      } else {
        dispatch(SetUser(null));
        message.error(response.message);
        localStorage.removeItem("token");
      }
    } catch (error) {
      dispatch(HideLoading());
      dispatch(SetUser(null));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    }
  }, []);
  return (
    <div className="layout">
      <div className="header bg-primary-gradient flex justify-between p-1">
        <div className="flex justify-center items-center">
          <h1
            className="text-md text-white cursor-pointer"
            onClick={() => navigate("/")}
          >
            MOVIES
          </h1>
        </div>
        {user ? (
          <div className="p-1 flex gap-1 items-center">
            <Avatar src={user.avatar}></Avatar>
            <h1
              className="text-sm underline text-white"
              onClick={() => {
                if (user.isAdmin) {
                  navigate("/admin");
                } else {
                  navigate("/profile");
                }
              }}
            >
              {user.name}
            </h1>
            <i
              className="ri-logout-circle-r-line text-white"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
            ></i>
          </div>
        ) : (
          <div className="p-1 flex gap-1">
            <h1
              className="text-sm underline text-white"
              onClick={() => {
                navigate("/login");
              }}
            >
              Đăng nhập
            </h1>
          </div>
        )}
      </div>
      <div className="content flex justify-center mt-1">{children}</div>
      <div className="footer bg-primary text-white p-3 mt-3 flex flex-col items-center">
        <p>Cinema Booking Website &copy; 2024 created by Trần Thanh Quang.</p>
        <div className="flex gap-1 mt-1">
          <p>Thông tin liên hệ:</p>
          <p><i className="ri-phone-line"></i> 0813 036 482 </p>
          <p>
          <i className="ri-facebook-circle-line"></i>{" "}
            <a
              href="https://www.facebook.com/thanhquang.t1.k98.lhp"
              className="underline text-white"
            >
            https://www.facebook.com/thanhquang.t1.k98.lhp
            </a>
          </p>
          <p><i className="ri-map-pin-line"></i> Hà Nội</p>
        </div>
      </div>
    </div>
  );
}

export default ProtectedRoute;
