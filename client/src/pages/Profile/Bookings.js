import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { message, Row, Col, Pagination, Checkbox } from "antd";
import { GetBookingsOfUser } from "../../api/bookings";
import moment from "moment";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4); // You can adjust the page size as needed
  const tempDate = new URLSearchParams(window.location.search).get("date");
  const [date, setDate] = useState(tempDate || moment().format("YYYY-MM-DD"));
  const [all, setAll] = useState(true);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex);
  const dispatch = useDispatch();

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetBookingsOfUser();
      if (response.success) {
        setBookings(response.data);
        if (all) {
          setFilteredBookings(response.data);
        } else {
          filterBookings(response.data, date);
        }
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const filterBookings = (bookings, selectedDate) => {
    const filtered = bookings.filter((booking) =>
      moment(booking.show.date).isSame(selectedDate, "day")
    );
    setFilteredBookings(filtered);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (all) {
      setFilteredBookings(bookings);
    } else {
      filterBookings(bookings, date);
    }
  }, [all, bookings, date]);

  return (
    <div className="flex flex-col">
      <div className="flex mb-2">
        <input
          style={{ width: "128px" }}
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
          }}
        />
        <Checkbox
          className="ml-2"
          style={{ display: "flex", alignItems: "center" }}
          checked={all}
          onChange={(e) => setAll(e.target.checked)}
        >
          <span>Tất cả</span>
        </Checkbox>
      </div>
      <div>
        <Row gutter={[16, 16]}>
          {paginatedBookings.map((booking) => (
            <Col span={12} key={booking._id}>
              <div className="card p-2 flex justify-between uppercase">
                <div>
                  <h1 className="text-xl">{booking.show.movie?.title}</h1>
                  <div className="divider"></div>
                  <h1 className="text-sm">
                    {booking.show.theatre.name} ({booking.show.theatre.address})
                  </h1>
                  <h1 className="text-sm">
                    Ngày và Giờ:{" "}
                    {moment(booking.show.date).format("DD/MM/YYYY")} -{" "}
                    {moment(booking.show.time, "HH:mm").format("hh:mm A")}
                  </h1>

                  <h1 className="text-sm">
                    Tổng Tiền : {new Intl.NumberFormat('vi-VN').format(booking.totalPrice)} VND
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
                  <h1 className="text-sm">{booking.show.name}</h1>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        <Pagination
          className="mt-2"
          current={currentPage}
          pageSize={pageSize}
          total={bookings.length}
          onChange={handlePageChange}
          showSizeChanger
          onShowSizeChange={handlePageChange}
          pageSizeOptions={["4", "8", "12"]}
        />
      </div>
    </div>
  );
}

export default Bookings;
