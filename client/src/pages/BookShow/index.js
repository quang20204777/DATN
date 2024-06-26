import { message, ConfigProvider, Button, Radio } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { GetShowById } from "../../api/theatres";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
// import { BookShowTickets } from "../../api/bookings";
// import { axiosInstance } from "../../api/index.js";

function BookShow() {
  const { user } = useSelector((state) => state.users);
  const [show, setShow] = React.useState(null);
  const [selectedSeats, setSelectedSeats] = React.useState([]);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [paymentMethod, setPaymentMethod] = React.useState("zalopay");
  const params = useParams();
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetShowById({
        showId: params.id,
      });
      if (response.success) {
        setShow(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handlePayment = async () => {
    try {
      dispatch(ShowLoading());
      const endpoint =
        paymentMethod === "zalopay"
          ? "http://localhost:5000/api/payments/create-payment-zalopay"
          : "http://localhost:5000/api/payments/create-payment-vnpay";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
          orderInfo: `Đặt vé: ${show.movie.title}`,
          show: params.id,
          seats: selectedSeats,
          totalPrice: totalPrice,
          user: user._id,
        }),
      });
      const data = await response.json();
      if (data.order_url) {
        window.location.href = data.order_url;
      } else {
        message.error("Khởi tạo giao dịch thất bại");
      }

      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getSeats = () => {
    const columns = 18;
    const totalSeats = show.totalSeats;
    const rows = Math.ceil(totalSeats / columns);

    const handleClick = (seatNumber, seat, column) => {
      if (selectedSeats.includes(seatNumber)) {
        if (seat === rows - 1 && column % 2 === 0) {
          let seatCouple =
            String.fromCharCode(65 + rows - 1) + (column + 2).toString();
          setSelectedSeats(
            selectedSeats.filter(
              (item) => item !== seatNumber && item !== seatCouple
            )
          );
        } else if (seat === rows - 1 && column % 2 === 1) {
          let seatCouple =
            String.fromCharCode(65 + rows - 1) + column.toString();
          setSelectedSeats(
            selectedSeats.filter(
              (item) => item !== seatNumber && item !== seatCouple
            )
          );
        } else {
          setSelectedSeats(selectedSeats.filter((item) => item !== seatNumber));
        }
        let newPrice = countPrice(seat, rows, totalPrice, true);
        setTotalPrice(newPrice);
      } else {
        if (seat === rows - 1 && column % 2 === 0) {
          let seatCouple =
            String.fromCharCode(65 + rows - 1) + (column + 2).toString();
          setSelectedSeats([...selectedSeats, seatNumber, seatCouple]);
        } else if (seat === rows - 1 && column % 2 === 1) {
          let seatCouple =
            String.fromCharCode(65 + rows - 1) + column.toString();
          setSelectedSeats([...selectedSeats, seatNumber, seatCouple]);
        } else {
          setSelectedSeats([...selectedSeats, seatNumber]);
        }
        let newPrice = countPrice(seat, rows, totalPrice, false);
        setTotalPrice(newPrice);
      }
    };

    const countPrice = (seat, row, price, isDelete) => {
      if (seat >= 4 && seat < row - 1) {
        if (isDelete) price -= show.ticketPrice + 5000;
        else price += show.ticketPrice + 5000;
        return price;
      }
      if (seat === row - 1) {
        if (isDelete) price -= show.ticketPrice * 2 + 10000;
        else price += show.ticketPrice * 2 + 10000;
        return price;
      }
      if (isDelete) price -= show.ticketPrice;
      else price += show.ticketPrice;
      return price;
    };

    return (
      <div className="flex flex-col p-2 card">
        <div className="screen"></div>
        <div className="flex gap-1 flex-col p-2 ">
          {Array.from(Array(rows).keys()).map((seat, rowIndex) => {
            return (
              <div key={rowIndex} className="flex gap-1 justify-center">
                {Array.from(Array(columns).keys()).map(
                  (column, columnIndex) => {
                    const seatNumber =
                      String.fromCharCode(65 + seat) + (column + 1).toString();
                    let seatClass = "seat";

                    if (
                      selectedSeats.includes(
                        String.fromCharCode(65 + seat) + (column + 1).toString()
                      )
                    ) {
                      seatClass = seatClass + " selected-seat";
                    }

                    if (seat >= 4 && seat < rows - 1) {
                      seatClass = seatClass + " seat-vip";
                    } else if (seat === rows - 1) {
                      seatClass = seatClass + " seat-vippro";
                    }

                    if (
                      show.bookedSeats.includes(
                        String.fromCharCode(65 + seat) + (column + 1).toString()
                      )
                    ) {
                      seatClass = seatClass + " booked-seat";
                    }

                    return (
                      seat * columns + column + 1 <= totalSeats && (
                        <div
                          key={`${rowIndex}-${columnIndex}`}
                          className={seatClass}
                          onClick={() => handleClick(seatNumber, seat, column)}
                        >
                          <h1 className="text-sm">
                            {String.fromCharCode(65 + seat) +
                              (column + 1).toString()}
                          </h1>
                        </div>
                      )
                    );
                  }
                )}
              </div>
            );
          })}
        </div>
        <div className=" mt-2 flex justify-center">
          <div className="flex uppercase p-2 gap-3">
            <h1 className="text-sm flex justify-center">
              <b>Đang chọn</b>
              <div className="ml-1 seat-info selected-seat"></div>
            </h1>

            <h1 className="text-sm flex justify-center">
              <b>Không thể chọn</b>
              <div className="ml-1 seat-info booked-seat"></div>
            </h1>

            <h1 className="text-sm flex justify-center">
              <b>VIP</b>
              <div className="ml-1 seat-info seat-vip"></div>
            </h1>

            <h1 className="text-sm flex justify-center">
              <b>Ghế đôi</b>
              <div className="ml-1 seat-info seat-vippro"></div>
            </h1>
          </div>
        </div>
      </div>
    );
  };

  // const book = async (transactionId) => {
  //   try {
  //     dispatch(ShowLoading());
  //     const response = await axiosInstance.post(
  //       "http://localhost:5000/api/payments/check-payment-status",
  //       { app_trans_id: transactionId }
  //     );
  //     if (response.data.success) {
  //       const bookResponse = await BookShowTickets({
  //         show: params.id,
  //         seats: selectedSeats,
  //         totalPrice: totalPrice,
  //         user: user._id,
  //         transactionId: transactionId,
  //       });
  //       if (bookResponse.success) {
  //         message.success(bookResponse.message);
  //         navigate("/profile");
  //       } else {
  //         message.error(bookResponse.message);
  //       }
  //     } else {
  //       message.error(response.data.message);
  //     }
  //     dispatch(HideLoading());
  //   } catch (error) {
  //     message.error(error.message);
  //     dispatch(HideLoading());
  //   }
  // };

  useEffect(() => {
    getData();
  }, []);

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   console.log(urlParams);
  //   const transactionId = urlParams.get("apptransid");
  //   const status = urlParams.get("status");
  //   if (transactionId && status === "1") {
  //     book(transactionId);
  //   }
  // }, []);

  return (
    show && (
      <div>
        {/* show information */}
        <div className="flex justify-between card p-2 items-center">
          <div>
            <h1 className="text-sm">{show.theatre.name}</h1>
            <h1 className="text-sm">{show.theatre.address}</h1>
          </div>
          <div>
            <h1 className="text-2xl uppercase">{show.movie.title}</h1>
          </div>
          <div>
            <h1 className="text-sm">
              {moment(show.date).format("DD/MM/YYYY")} -{" "}
              {moment(show.time, "HH:mm").format("hh:mm A")}
            </h1>
          </div>
        </div>
        {/* seats */}
        <div className="flex justify-center mt-2">{getSeats()}</div>
        {selectedSeats.length > 0 && (
          <div className="mt-2 flex justify-center gap-2 items-center flex-col">
            <div className="flex justify-center">
              <div className="flex uppercase card p-2 gap-3">
                <h1 className="text-sm">
                  <b>Ghế đã chọn</b> : {selectedSeats.join(" , ")}
                </h1>
                <h1 className="text-sm">
                  <b>Tổng tiền</b> : {new Intl.NumberFormat('vi-VN').format(totalPrice)} VND
                </h1>
              </div>
            </div>
            <div className="flex uppercase card p-2 gap-3">
              <h1 className="text-sm">Phương thức thanh toán: </h1>
              <Radio.Group
                onChange={(e) => setPaymentMethod(e.target.value)}
                value={paymentMethod}
              >
                <Radio value="zalopay">ZaloPay</Radio>
                <Radio value="vnpay">VNPay</Radio>
              </Radio.Group>
            </div>

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
                onClick={() => handlePayment()}
              >
                Đặt ngay
              </Button>
            </ConfigProvider>
          </div>
        )}
      </div>
    )
  );
}

export default BookShow;
