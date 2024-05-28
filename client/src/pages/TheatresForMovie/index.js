import React, { useEffect, useState } from "react";
import {
  message,
  Row,
  Col,
  List,
  Card,
  Tag,
  Divider,
  Button
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetMovieById } from "../../api/movies";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { GetAllTheatresByMovie } from "../../api/theatres";
import blurLeft from "../../assets/blur-left.png";
import blurRight from "../../assets/blur-right.png";
import playTrailer from "../../assets/play-button.png";
import ModalVideo from "../../components/ModalVideo.js";



function TheatresForMovie() {
  // get date from query string
  const tempDate = new URLSearchParams(window.location.search).get("date");
  const [date, setDate] = useState(tempDate || moment().format("YYYY-MM-DD"));
  const { nowShowing } = useSelector((state) => state.movies);
  const [showVideo, setShowVideo] = useState(false);
  const { Meta } = Card;

  const [movie, setMovie] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetMovieById(params.id);
      if (response.success) {
        setMovie(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getTheatres = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllTheatresByMovie({ date, movie: params.id });
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
  }, [location]);

  useEffect(() => {
    getTheatres();
  }, [date, location]);
  const loadMore = (
    <div
      style={{
        textAlign: "center",
        marginTop: 12,
        height: 32,
        lineHeight: "32px",
      }}
    >
      <Button
        onClick={() => {
          navigate("/");
        }}
      >Xem thêm</Button>
    </div>
  );
  return (
    movie && (
      <div className="flex flex-col items-center">
        <div className="relative bg-black flex justify-center w-full h-full">
          <div className="absolute w-full h-full z-300 bg-third"></div>
          <div className="relative h-full">
            <div className="absolute top-0 left-0 z-100 h-full">
              <img
                alt="Blur Left"
                src={blurLeft}
                style={{ color: "transparent", height: "100%" }}
              />
            </div>
            <div className="relative h-full">
              <img
                src={movie.coverPoster}
                alt="cover-poster-movie"
                width={800}
                style={{ height: "100%" }}
              />
              <button
                className="absolute button-player"
                onClick={() => setShowVideo(true)}
              >
                <img src={playTrailer} alt="play" />
              </button>
            </div>

            <div className="absolute top-0 right-0 z-100 h-full">
              <img
                alt="Blur Right"
                src={blurRight}
                style={{ color: "transparent", height: "100%" }}
              />
            </div>
          </div>
        </div>
        <div className="w-80">
          <Row gutter={[20, 20]}>
            <Col span={24}></Col>
            <Col span={17}>
              {/* movie information */}
              <div className="flex mb-2">
                <div className="flex">
                  <img
                    src={movie.poster}
                    alt="poster movie"
                    height={400}
                    style={{ border: "2px solid white", opacity: 1 }}
                  />
                  <div className="flex flex-col justify-center">
                    <div className="ml-2">
                      <h1 className="text-2xl uppercase">
                        {movie.title} &nbsp;&nbsp;
                        <span className="text-md bg-secondary text-white p-1 radius-1">
                          {movie.age}
                        </span>
                      </h1>
                      <p className="text-md mt-2">
                        <span className="text-grey-40">Thời lượng: </span>
                        &nbsp;&nbsp; {movie.duration} phút
                      </p>
                      <p className="text-md mt-1">
                        <span className="text-grey-40">Ngày phát hành: </span>
                        &nbsp;&nbsp;
                        {moment(movie.releaseDate).format("DD/MM/YYYY")}
                      </p>
                      <p className="text-md mt-1">
                        {" "}
                        <span className="text-grey-40">Quốc gia: </span>{" "}
                        &nbsp;&nbsp;{movie.nation}
                      </p>
                      <p className="text-md mt-1">
                        {" "}
                        <span className="text-grey-40">
                          Nhà sản xuất:{" "}
                        </span>{" "}
                        &nbsp;&nbsp;{movie.producer? movie.producer : "Chưa có dữ liệu"}
                      </p>
                      <p className="text-md mt-1">
                        {" "}
                        <span className="text-grey-40">Thể loại: </span>
                        &nbsp;&nbsp;{" "}
                        {movie.genre &&
                          movie.genre.map((genre, index) => (
                            <Tag
                              key={index}
                              style={{
                                paddingTop: "7px",
                                paddingBottom: "7px",
                              }}
                            >
                              <span className="text-md">{genre}</span>
                            </Tag>
                          ))}
                      </p>
                      <p className="text-md mt-1">
                        <span className="text-grey-40">Diễn viên: </span>
                        &nbsp;&nbsp; {movie.cast? movie.cast : "Chưa có dữ liệu"}
                      </p>
                      <p className="text-md mt-1">
                        <span className="text-grey-40">Đạo diễn: </span>
                        &nbsp;&nbsp; {movie.crew? movie.crew : "Chưa có dữ liệu"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div>
                  <h1 className="text-md">Nội dung phim:</h1>
                  <br />
                  {movie.description &&
                    movie.description.split("\n").map((paragraph, index) => (
                      <div
                        key={index}
                        className="text-sm justify-text"
                        style={{
                          whiteSpace: "pre-line",
                          lineHeight: "1.5",
                          marginBottom: "10px",
                        }}
                      >
                        {paragraph}
                      </div>
                    ))}
                </div>
              </div>

              <hr className="mt-1" />

              {/* movie theatres */}
              <div className="mt-1 flex justify-between">
                <h1 className="text-xl uppercase">Lịch chiếu</h1>
                <div>
                  <input
                    type="date"
                    min={moment().format("YYYY-MM-DD")}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      navigate(`/movie/${params.id}?date=${e.target.value}`);
                    }}
                  />
                </div>
              </div>

              <div className="mt-1 flex flex-col gap-1">
                {theatres && theatres.length > 0? theatres.map((theatre, index) => (
                  <div  key={index} className="card p-2">
                    <h1 className="text-md uppercase">{theatre.name}</h1>
                    <h1 className="text-sm">Địa chỉ : {theatre.address}</h1>

                    <div className="divider"></div>

                    <div className="flex gap-2">
                      {theatre.shows
                        .sort(
                          (a, b) =>
                            moment(a.time, "HH:mm") - moment(b.time, "HH:mm")
                        )
                        .map((show, index) => (
                          <div
                            key={index}
                            className="card p-1 cursor-pointer"
                            onClick={() => {
                              if (localStorage.getItem("token")) {
                                navigate(`/book-show/${show._id}`);
                              } else {
                                message.warning(
                                  "Hãy đăng nhập để đặt vé xem phim!"
                                );
                              }
                            }}
                          >
                            <h1 className="text-sm">
                              {moment(show.time, "HH:mm").format("hh:mm A")}
                            </h1>
                          </div>
                        ))}
                    </div>
                  </div>
                )) : (<p>Xin lỗi, không có suất chiếu vào ngày này, hãy chọn một ngày khác.</p>)}
              </div>
            </Col>
            {/* Đang chiếu */}
            <Col xs={0} sm={0} md={7} lg={7}>
              <div className="flex justify-center flex-col">
                <h1 className="left-text text-xl uppercase">
                  {" "}
                  Phim Đang Chiếu{" "}
                </h1>
                <Divider style={{ marginTop: "8px", marginBottom: "8px" }} />
                <List
                  style={{ marginTop: "10px" }}
                  loadMore={loadMore}
                  dataSource={nowShowing
                    .filter((movie) => movie._id !== params.id)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3)}
                  renderItem={(movie) => (
                    <List.Item>
                      <Card
                        onClick={() => {
                          navigate(
                            `/movie/${movie._id}?date=${moment().format(
                              "YYYY-MM-DD"
                            )}`
                          );
                        }}
                        style={{
                          cursor: "pointer",
                          border: "none",
                          width: "100%",
                          borderRadius: 0,
                        }}
                        cover={
                          <img
                            src={movie.coverPoster}
                            alt="poster"
                            height={175}
                            style={{ border: "none", borderRadius: 0 }}
                          />
                        }
                      >
                        <Meta
                          title={movie.title}
                          style={{ textAlign: "left" }}
                        />
                      </Card>
                    </List.Item>
                  )}
                />
              </div>
            </Col>
          </Row>
        </div>
       <ModalVideo open={showVideo} setOpen={setShowVideo} url={movie.trailer} />
      </div>
    )
  );
}

export default TheatresForMovie;
