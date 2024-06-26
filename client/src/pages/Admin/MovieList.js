import React, { useState, useEffect } from "react";
import MovieForm from "./MovieForm.js";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../../redux/loadersSlice.js";
import { GetAllMovies, DeleteMovie } from "../../api/movies.js";
import { Table, message, Popconfirm, Button, ConfigProvider } from "antd";
import moment from "moment";
import { QuestionCircleOutlined } from "@ant-design/icons";
import removeAccents from "remove-accents";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showMovieFormModal, setShowMovieFormModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formType, setFormType] = useState("add");
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllMovies();
      if (response.success) {
        setMovies(response.data);
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

  const handleDelete = async (movieId) => {
    try {
      dispatch(ShowLoading());
      const response = await DeleteMovie({
        movieId,
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
      title: "Poster",
      dataIndex: "poster",
      render: (text, record) => {
        return (
          <img
            src={record.coverPoster}
            alt="poster"
            height="60"
            width="80"
            className="br-1"
          />
        );
      },
    },
    {
      title: "Tên Phim",
      dataIndex: "title",
    },

    {
      title: "Nội dung",
      dataIndex: "description",
      className: "justify-text",
    },
    {
      title: "Thời lượng",
      dataIndex: "duration",
    },
    {
      title: "Thể loại",
      dataIndex: "genre",
      render: (text, record) => {
        return record.genre.join(", ");
      },
    },
    {
      title: "Quốc gia",
      dataIndex: "nation",
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      render: (text, record) => {
        return moment(record.releaseDate).format("DD-MM-YYYY");
      },
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
              description="Xác nhận xóa bộ phim này?"
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
                setSelectedMovie(record);
                setFormType("edit");
                setShowMovieFormModal(true);
              }}
            ></i>
          </div>
        );
      },
    },
  ];

  const filteredMovies = movies.filter((movie) =>
    removeAccents(movie.title.toLowerCase()).includes(
      removeAccents(searchText.toLowerCase())
    )
  );

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
              setShowMovieFormModal(true);
              setFormType("add");
            }}
          >
            Thêm phim
          </Button>
        </ConfigProvider>
      </div>

      <Table
        columns={columns}
        dataSource={filteredMovies}
        pagination={{ pageSize: 10 }}
      ></Table>
      {showMovieFormModal && (
        <MovieForm
          showMovieFormModal={showMovieFormModal}
          setShowMovieFormModal={setShowMovieFormModal}
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          getData={getData}
          formType={formType}
        />
      )}
    </div>
  );
};

export default MovieList;
