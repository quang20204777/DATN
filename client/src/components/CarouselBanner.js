import React from "react";
import { Carousel, Button } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const CarouselBanner = ({ movies }) => {
  const settings = {
    // effect: "scrollx",
    autoplay: true,
  };
  const navigate = useNavigate();
  const contentStyle = {
    width: "100%",
    height: "640px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  return (
    <div style={{ width: "100%", height: "640px" }}>
      <Carousel
        {...settings}
        arrows
        pauseOnHover={true}
        pauseOnDotsHover={true}
        draggable
      >
        {movies.slice(0, 4).map((movie, index) => (
          <div style={contentStyle} key={index}>
            <div
              style={{
                backgroundImage: `url(${movie.coverPoster})`,
                backgroundSize: "100% 100%",
                height: "640px",
              }}
            >
              <div
                style={{
                  backgroundColor: "rgba(0,0,0,0.6)",
                  width: "100%",
                  height: "640px",
                }}
              >
                <p
                  style={{
                    textAlign: "left",
                    paddingLeft: "70px",
                    paddingTop: "160px",
                    boxSizing: "border-box",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "33px",
                    width: "calc(100% / 3)",
                  }}
                >
                  {movie.title}
                </p>
                <p
                  style={{
                    textAlign: "justify",
                    paddingLeft: "70px",
                    paddingTop: "10px",
                    boxSizing: "border-box",
                    color: "white",
                    fontWeight: "400",
                    fontSize: "18px",
                    width: "calc(100% / 3)",
                    
                  }}
                >
                {movie.description.length > 250 ? `${movie.description.substring(0, 250)}...` : movie.description}
                </p>
                <div
                  style={{
                    textAlign: "left",
                    paddingLeft: "70px",
                    paddingTop: "10px",
                  }}
                >
                  <Button
                    ghost
                    onClick={() =>
                      navigate(
                        `/movie/${movie._id}?date=${moment().format(
                          "YYYY-MM-DD"
                        )}`
                      )
                    }
                  >
                    {" "}
                    Xem thêm
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};
export default CarouselBanner;
