import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../../redux/loadersSlice.js";
import { GetAllUsers, DeleteUser  } from "../../api/users.js";
import { Table, message, Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllUsers();
      if (response.success) {
        setUsers(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDelete = async (accountId) => {
    try {
      dispatch(ShowLoading());
      const response = await DeleteUser({
        accountId,
      });
      if (response.success) {
        message.success(response.message);
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

  const columns = [
    {
      title: "Tên Khách Hàng",
      dataIndex: "name",
    },

    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-1">
            <Popconfirm
              title="Cảnh báo"
              placement="topLeft"
              okText={<span className="text-white">Xác nhận</span>}
              cancelText="Hủy"
              description="Xác nhận xóa tài khoản này?"
              icon={
                <QuestionCircleOutlined
                  style={{
                    color: "red",
                  }}
                />
              }
              onConfirm={() => {
                handleDelete(record._id);
              }}
            >
              <i className="ri-delete-bin-line icon delete-icon"></i>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const filteredUsers = users.filter((user) => user.phone && user.phone.includes(searchText));

  return (
    <div>
        <div className="flex justify-between mb-1">
          <input
            type="text"
            className="input-search"
            placeholder="Tìm kiếm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
  
        <Table
          columns={columns}
          dataSource={filteredUsers}
          pagination={{ pageSize: 10 }}
        ></Table>
      </div>
  );
};

export default UserList;
