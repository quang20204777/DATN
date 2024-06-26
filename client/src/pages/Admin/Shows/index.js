import {
  Col,
  Form,
  Modal,
  Row,
  Select,
  Table,
  message,
  Popconfirm,
  Button,
  ConfigProvider,
} from "antd";
import React, { useEffect } from "react";
import { GetAllMovies } from "../../../api/movies";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loadersSlice";
import {
  AddShow,
  DeleteShow,
  GetAllShowsByTheatre,
} from "../../../api/theatres";
import moment from "moment";
import { roomNameOption } from "../../types.js";
import { QuestionCircleOutlined } from "@ant-design/icons";

function Shows({ openShowsModal, setOpenShowsModal, theatre }) {
  const [view, setView] = React.useState("table");
  const [shows, setShows] = React.useState([]);
  const [movies, setMovies] = React.useState([]);
  const [targetRoomName, setTargetRoomName] = React.useState("");
  const [targetDate, setTargetDate] = React.useState("");
  const [filteredShows, setFilteredShows] = React.useState([]);

  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const moviesResponse = await GetAllMovies();
      if (moviesResponse.success) {
        setMovies(moviesResponse.data);
      } else {
        message.error(moviesResponse.message);
      }
      const showsResponse = await GetAllShowsByTheatre({
        theatreId: theatre._id,
      });
      if (showsResponse.success) {
        setShows(showsResponse.data);
      } else {
        message.error(showsResponse.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };
  const handleAddShow = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await AddShow({
        ...values,
        theatre: theatre._id,
      });
      if (response.success) {
        message.success(response.message);
        getData();
        setView("table");
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  const handleDelete = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await DeleteShow({ showId: id });

      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  const columns = [
    {
      title: "Tên phòng",
      dataIndex: "name",
    },
    {
      title: "Ngày chiếu",
      dataIndex: "date",
      render: (text, record) => {
        return moment(text).format("DD/MM/YYYY");
      },
    },
    {
      title: "Bắt đầu",
      dataIndex: "time",
    },
    { title: "Kết thúc", dataIndex: "endTime" },
    {
      title: "Phim",
      dataIndex: "movie",
      render: (text, record) => {
        return record.movie.title;
      },
    },
    {
      title: "Giá vé",
      dataIndex: "ticketPrice",
    },
    {
      title: "Số ghế",
      dataIndex: "totalSeats",
    },
    {
      title: "Số ghế còn lại",
      dataIndex: "availableSeats",
      render: (text, record) => {
        return record.totalSeats - record.bookedSeats.length;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-1 items-center">
            {(record.bookedSeats.length === 0 ||
              moment(record.date).isBefore(moment(), "day")) && (
              <Popconfirm
                title="Cảnh báo"
                placement="topLeft"
                okText={<span className="text-white">Xác nhận</span>}
                cancelText="Hủy"
                description="Xác nhận xóa lịch chiếu?"
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
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  // Lọc danh sách các show dựa trên roomName và ngày được chọn
  useEffect(() => {
    if (targetRoomName && targetDate) {
      const filtered = shows.filter(
        (show) =>
          show.name === targetRoomName &&
          moment(show.date).format("YYYY-MM-DD") === targetDate
      );
      setFilteredShows(filtered);
    } else {
      setFilteredShows([]);
    }
  }, [shows, targetRoomName, targetDate]);

  return (
    <Modal
      title=""
      open={openShowsModal}
      onCancel={() => setOpenShowsModal(false)}
      width={1400}
      footer={null}
    >
      <h1 className="text-primary text-md uppercase mb-1">
        Rạp chiếu : {theatre.name}
      </h1>
      <hr />

      <div className="flex justify-between mt-1 mb-1 items-center">
        <h1 className="text-md uppercase">
          {view === "table" ? "Lịch chiếu" : "Thêm lịch chiếu"}
        </h1>
        {view === "table" && (
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
                setView("form");
              }}
            >
              Thêm lịch chiếu
            </Button>
          </ConfigProvider>
        )}
      </div>

      {view === "table" && (
        <Table
          columns={columns}
          dataSource={shows}
          pagination={{ pageSize: 10 }}
        />
      )}

      {view === "form" && (
        <Form layout="vertical" onFinish={handleAddShow}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Table
                columns={columns}
                dataSource={filteredShows}
                pagination={{ pageSize: 10 }}
              />
            </Col>
            <Col span={8}>
              <Form.Item
                label="Tên Phòng"
                name="name"
                rules={[{ required: true, message: "Hãy chọn phòng chiếu!" }]}
              >
                <Select
                  placeholder="Chọn phòng"
                  style={{
                    height: "40px",
                    border: "1px solid #8a8a8a",
                    width: "100%",
                  }}
                  onChange={(value) => {
                    setTargetRoomName(value);
                  }}
                >
                  {roomNameOption.map((roomName, index) => (
                    <Select.Option key={index} value={roomName}>
                      {roomName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Ngày chiếu"
                name="date"
                rules={[{ required: true, message: "Hãy nhập ngày chiếu!" }]}
              >
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(event) => {
                    setTargetDate(event.target.value);
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Bắt đầu"
                name="time"
                rules={[
                  { required: true, message: "Hãy nhập thời gian bắt đầu!" },
                ]}
              >
                <input type="time" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Phim"
                name="movie"
                rules={[{ required: true, message: "Hãy chọn phim!" }]}
              >
                <Select
                  placeholder="Chọn phim"
                  style={{
                    height: "40px",
                    border: "1px solid #8a8a8a",
                    width: "100%",
                  }}
                >
                  {movies &&
                    movies.map((movie) => (
                      <Select.Option value={movie._id}>
                        {movie.title}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Giá vé"
                name="ticketPrice"
                rules={[{ required: true, message: "Hãy nhập giá vé!" }]}
              >
                <input type="number" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Số ghế"
                name="totalSeats"
                rules={[{ required: true, message: "Hãy nhập số lượng ghế!" }]}
              >
                <input type="number" />
              </Form.Item>
            </Col>
          </Row>

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
                  setView("table");
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
      )}
    </Modal>
  );
}

export default Shows;
