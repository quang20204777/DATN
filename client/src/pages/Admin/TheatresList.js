import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../../redux/loadersSlice.js";
import { DeleteTheatre, GetAllTheatres } from "../../api/theatres.js";
import { message, Table, Popconfirm, ConfigProvider, Button } from "antd";
// import { useNavigate } from "react-router-dom";
import TheatreForm from "./TheatreForm.js";
import Shows from "./Shows/index.js";
import { QuestionCircleOutlined } from "@ant-design/icons";

const TheatresList = () => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [theatres, setTheatres] = useState([]);
  const [showTheatreFormModal, setShowTheatreFormModal] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [formType, setFormType] = useState("add");
  const [openShowsModal, setOpenShowsModal] = useState(false);

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllTheatres();
      if (response.success) {
        setTheatres(response.data);
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
  const handleDelete = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await DeleteTheatre({ theatreId: id });
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
      title: "Tên rạp",
      dataIndex: "name",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-1 items-center">
            <Popconfirm
              title="Cảnh báo"
              placement="topLeft"
              okText={<span className="text-white">Xác nhận</span>}
              cancelText="Hủy"
              description="Xác nhận xóa rạp chiếu này?"
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
            <i
              className="ri-pencil-line icon edit-icon"
              onClick={() => {
                setFormType("edit");
                setSelectedTheatre(record);
                setShowTheatreFormModal(true);
              }}
            ></i>
            <span
              className="underline"
              onClick={() => {
                setSelectedTheatre(record);
                setOpenShowsModal(true);
              }}
            >
              Lịch chiếu
            </span>
          </div>
        );
      },
    },
  ];

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
            style={{ height: "40px" }}
            onClick={() => {
              setFormType("add");
              setShowTheatreFormModal(true);
            }}
          >
            Thêm rạp chiếu
          </Button>
        </ConfigProvider>
      </div>

      <Table
        columns={columns}
        dataSource={theatres.filter((theatre) =>
          theatre.name.toLowerCase().includes(searchText.toLowerCase())
        )}
        pagination={{ pageSize: 10 }}
      />

      {showTheatreFormModal && (
        <TheatreForm
          showTheatreFormModal={showTheatreFormModal}
          setShowTheatreFormModal={setShowTheatreFormModal}
          formType={formType}
          setFormType={setFormType}
          selectedTheatre={selectedTheatre}
          setSelectedTheatre={setSelectedTheatre}
          getData={getData}
        />
      )}

      {openShowsModal && (
        <Shows
          openShowsModal={openShowsModal}
          setOpenShowsModal={setOpenShowsModal}
          theatre={selectedTheatre}
        />
      )}
    </div>
  );
};

export default TheatresList;
