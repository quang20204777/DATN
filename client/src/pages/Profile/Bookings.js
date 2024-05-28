import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { message, Row, Col } from "antd";
import { GetBookingsOfUser } from "../../api/bookings";
import moment from "moment";

function Bookings() {
  const [bookings = [], setBookings] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetBookingsOfUser();
      if (response.success) {
        setBookings(response.data);
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
  return (
    <div>
      <Row gutter={[16, 16]}>
        {bookings.map((booking) => (
          <Col span={12}>
            <div className="card p-2 flex justify-between uppercase">
              <div>
                
                <h1 className="text-xl">
                  {booking.show.movie?.title}
                </h1>
                <div className="divider"></div>
                <h1 className="text-sm">
                  {booking.show.theatre.name} ({booking.show.theatre.address})
                </h1>
                <h1 className="text-sm">
                  Ngày và Giờ: {moment(booking.show.date).format("DD/MM/YYYY")}{" "}
                  - {moment(booking.show.time, "HH:mm").format("hh:mm A")}
                </h1>

                <h1 className="text-sm">
                  Tổng Tiền : {booking.totalPrice},000 VND
                </h1>
                <h1 className="text-sm">Booking ID: {booking._id}</h1>
                {booking.statusCheckin === 1 && (
                  <h1 className="text-sm">Trạng thái: Đã sử dụng</h1>
                )}
                {booking.statusCheckin === 0 && (
                  <h1 className="text-sm">Trạng thái: Chưa sử dụng</h1>
                )}
                {booking.statusCheckin === -1 && (
                  <h1 className="text-sm">Trạng thái: Đã quá hạn</h1>
                )}
              </div>

              <div>
                <div className="flex justify-end">
                <img
                src={booking.show.movie?.poster}
                alt=""
                height={100}
                width={100}
                className="br-1"
              />
                </div>
               
                <h1 className="text-sm">Ghế: {booking.seats.join(", ")}</h1>
                <h1 className= "text-sm">{booking.show.name}</h1>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Bookings;