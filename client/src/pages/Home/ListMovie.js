import React, { useEffect, useState } from "react";
import { List, Card, message, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { ShowLoading, HideLoading } from "../../redux/loadersSlice.js";
import { GetMovieComingSoon, GetMovieNowShowing } from "../../api/movies.js";
import { SetMovieNowShowing } from "../../redux/moviesSlice.js";
const ListMovie = ({ checkNowShowing }) => {
  const { nowShowing } = useSelector((state) => state.movies);
  const [visibleItems, setVisibleItems] = useState(8);
  const [moviesComingSoon, setMoviesComingSoon] = useState([]);

  const navigate = useNavigate();
  const { Meta } = Card;
  const dispatch = useDispatch();
  const getData = async () => {
    if (checkNowShowing) {
      try {
        dispatch(ShowLoading());
        const response = await GetMovieNowShowing();
        if (response.success) {
          dispatch(SetMovieNowShowing(response.data));
        } else {
          message.error(response.message);
        }
        dispatch(HideLoading());
      } catch (error) {
        dispatch(HideLoading());
        message.error(error.message);
      }
    } else {
      try {
        dispatch(ShowLoading());
        const response = await GetMovieComingSoon();
        if (response.success) {
          setMoviesComingSoon(response.data);
        } else {
          message.error(response.message);
        }
        dispatch(HideLoading());
      } catch (error) {
        dispatch(HideLoading());
        message.error(error.message);
      }
    }
  };
  const loadMore = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 8);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <List
        style={{ marginTop: "10px" }}
        grid={{ gutter: 16, xs: 2, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
        dataSource={
          checkNowShowing
            ? nowShowing.slice(0, visibleItems)
            : moviesComingSoon.slice(0, visibleItems)
        }
        loadMore={
          <div
            style={{
              textAlign: "center",
              marginTop: 12,
              height: 32,
              lineHeight: "32px",
            }}
          >
            {" "}
            <Button onClick={loadMore}>Xem thêm</Button>{" "}
          </div>
        }
        renderItem={(movie) => (
          <List.Item style={{padding: "8px"}}>
            <Card
              onClick={() =>
                navigate(
                  `/movie/${movie._id}?date=${moment().format("YYYY-MM-DD")}`
                )
              }
              style={{ cursor: "pointer", border: "none", borderRadius: "5px" }}
              cover={
                <img
                  src={movie.poster}
                  alt="poster"
                  style={{ height: "60%" , border: "none", borderRadius: "5px" }}
                />
              }
            >
              <Meta title={movie.title} style={{ textAlign: "left" }} />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ListMovie;
