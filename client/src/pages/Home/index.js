import React, { useState, useEffect } from "react";
import { Divider, Row, Tabs, message, Col } from "antd";
import CarouselBanner from "../../components/CarouselBanner.js";
import ListMovie from "./ListMovie.js";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../../redux/loadersSlice.js";
import { GetAllMovies } from "../../api/movies.js";
import benefit from "../../assets/benefit.png";

function Home() {
  const [movies, setMovies] = useState([]);
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
  
  const items = [
    {
      key: "1",
      label: "Đang chiếu",
      children: <ListMovie checkNowShowing={true}></ListMovie>,
    },
    {
      key: "2",
      label: "Sắp chiếu",
      children: <ListMovie checkNowShowing={false}></ListMovie>,
    },
  ];
  return (
    <div className="w-full flex flex-col items-center">
      <CarouselBanner movies={movies}/>
      <Divider />
      <div className="w-80">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
      <Divider style={{marinTop: "24px", marginBottom: "80px"}}/>
      <p style={{ fontWeight: 'bold', fontSize: '32px' }} className="text-third">Lợi ích của việc xem phim tại rạp</p>
      <p style={{ fontWeight: '400', fontSize: '18px', padding: '10px 280px' }}>Không chỉ để thư giãn và giải trí, xem phim tại rạp có rất nhiều lợi ích</p>
      <Row style={{ width: '100%', height: '800px', marginTop: '40px' }}>
        <Col className="gutter-row" span={14} style={{ textAlign: 'left', paddingLeft: '120px' }}>
          <Row style={{ width: '100%', marginTop: '40px' }}>
            <Col span={4}>
            <i className="ri-number-1 text-third" style={{ fontSize: '80px' }}></i>
            </Col>
            <Col span={18}>
              <p style={{ fontSize: '23px', fontWeight: '700' }} className="text-third">Trải nghiệm đầu tiên</p>
              <p style={{ fontSize: '16px', textAlign: 'justify' }}> Không cần phải chờ đợi quá lâu trên Internet, bạn sẽ là một trong những người đầu tiên được xem bộ phim đó. </p>
            </Col>
          </Row>
          <Row style={{ width: '100%', marginTop: '30px' }}>
            <Col span={4}>
              <i className="ri-sound-module-line text-third" style={{ fontSize: '80px' }} ></i>
            </Col>
            <Col span={18}>
              <p style={{ fontSize: '23px', fontWeight: '700' }} className="text-third">Hình ảnh, âm thanh chất lượng cao</p>
              <p style={{ fontSize: '16px', textAlign: 'justify' }}> Chất lượng hình ảnh và âm thanh là yếu tố tối quan trọng quyết định tới chất lượng của bộ phim, ảnh hưởng trực tiếp đến cảm xúc của người xem. Tại rạp sẽ cung cấp cho người xem hệ thống âm thanh chất lượng cao, hình ảnh sắc nét, chân thực.</p>
            </Col>
          </Row>
          <Row style={{ width: '100%', marginTop: '30px' }}>
            <Col span={4}>
            <i className="ri-emotion-happy-line text-third" style={{ fontSize: '80px' }}></i>
            </Col>
            <Col span={18}>
              <p style={{ fontSize: '23px', fontWeight: '700' }} className="text-third">Cảm giác chân thực, sống động</p>
              <p style={{ fontSize: '16px', textAlign: 'justify' }}> Từ việc hình ảnh và âm thanh chất lượng cao, thêm vào đó là màn hình lớn, giúp cho người xem được trải nghiệm cảm giác chân thực giống như ngoài đời thật. </p>
            </Col>
          </Row>
          <Row style={{ width: '100%', marginTop: '30px' }}>
            <Col span={4}>
            <i className="ri-building-2-line text-third" style={{ fontSize: '80px' }}></i>
            </Col>
            <Col span={18}>
              <p style={{ fontSize: '23px', fontWeight: '700' }} className="text-third">Chất lượng cơ sở hạ tầng</p>
              <p style={{ fontSize: '16px', textAlign: 'justify' }}>Đến với rạp chiếu phim chúng ta sẽ có được sự thoải mái tiện lợi vô cùng. Nội thất, ghế rạp chiếu phim đều có chất lượng tuyệt vời. Người xem có thể thoải mái tận hưởng toàn bộ bộ phim mà không hề bị khó chịu.</p>
            </Col>
          </Row>
        </Col>
        <Col span={10} style={{ marginTop: '50px' }}>
          <div style={{ backgroundImage: `url(${benefit})`, backgroundSize: '100% 100%', width: '72%', height: '59%', marginLeft: '80px',  }}></div>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
