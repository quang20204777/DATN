import React, { useEffect } from "react";
import { axiosInstance } from "../../api/index.js";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const transactionId = urlParams.get("apptransid");
  const transactionIdVNPay = urlParams.get("responseCode")
  const checkPaymentStatus = async () => {
    if (transactionId) {
      const response = await axiosInstance.post(
        "http://localhost:5000/api/payments/check-payment-status",
        { app_trans_id: transactionId }
      );
      if (response.data.return_code === 1) {
        message.success("Đặt vé thành công")
        navigate('/profile')
      }else {
        message.error("Đặt vé thất bại")
        navigate('/profile')
      }
    } else {
      if (transactionIdVNPay === '00') {
        message.success("Đặt vé thành công")
        navigate('/profile')
      } else {
        message.error("Đặt vé thất bại")
        navigate('/profile')
      }
    }
   
  };
  useEffect(()=> {
    checkPaymentStatus()
  }, [])

  return <div></div>;
};

export default Payment;
