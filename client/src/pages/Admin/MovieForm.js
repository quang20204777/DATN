import {
  Form,
  Modal,
  Row,
  Col,
  message,
  Select,
  Divider,
  ConfigProvider,
  Button,
} from "antd";
import React from "react";
import moment from "moment";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { useDispatch } from "react-redux";
import { AddMovie, UpdateMovie } from "../../api/movies.js";
import { nationOption, genreOption, ageOption } from "../types.js";

const MovieForm = ({
  showMovieFormModal,
  setShowMovieFormModal,
  selectedMovie,
  setSelectedMovie,
  getData,
  formType,
}) => {
  const dispatch = useDispatch();
  if (selectedMovie) {
    selectedMovie.releaseDate = moment(selectedMovie.releaseDate).format(
      "YYYY-MM-DD"
    );
  }

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response = null;
      if (formType === "add") {
        response = await AddMovie(values);
      } else {
        response = await UpdateMovie({
          ...values,
          movieId: selectedMovie._id,
        });
      }

      if (response.success) {
        getData();
        message.success(response.message);
        setShowMovieFormModal(false);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <Modal
      title={formType === "add" ? "THÊM PHIM" : "CHỈNH SỬA PHIM"}
      open={showMovieFormModal}
      onCancel={() => setShowMovieFormModal(false)}
      footer={null}
      width={800}
    >
      <Divider style={{ margin: "5px" }} />
      <Form layout="vertical" initialValues={selectedMovie} onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Tên phim" name="title" rules={[{ required: true, message: "Hãy nhập tên phim!" }]}>
              <input type="text" placeholder="Nhập tên phim"></input>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Nội dung" name="description" rules={[{ required: true, message: "Hãy nhập nội dung mô tả!" }]}>
              <textarea type="text" placeholder="Nhập nội dung" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Thời lượng" name="duration" rules={[{ required: true, message: "Hãy nhập thời lượng phim!" }]}>
              <input type="number" placeholder="Thời lượng" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Quốc gia" name="nation" rules={[{ required: true, message: "Hãy chọn tên quốc gia!" }]}>
              <Select
                placeholder="Chọn quốc gia"
                style={{
                  height: "40px",
                  border: "1px solid #8a8a8a",
                  width: "100%",
                }}
              >
                {nationOption.map((nation) => (
                  <Select.Option value={nation}>{nation}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Ngày phát hành" name="releaseDate" rules={[{ required: true, message: "Hãy nhập ngày phát hành!" }]}>
              <input type="date" />
            </Form.Item>
          </Col>
 
          <Col span={16}>
            <Form.Item label="Thể loại" name="genre" rules={[{ required: true, message: "Hãy chọn thể loại phim!" }]}>
              <Select
                mode="multiple"
                placeholder="Chọn thể loại"
                style={{
                  height: "40px",
                  border: "1px solid #8a8a8a",
                  width: "100%",
                }}
              >
                {" "}
                {genreOption.map((genre) => (
                  <Select.Option value={genre}>{genre}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Độ tuổi" name="age" rules={[{ required: true, message: "Hãy chọn độ tuổi!" }]}>
              <Select
                placeholder="Chọn độ tuổi"
                style={{
                  height: "40px",
                  border: "1px solid #8a8a8a",
                  width: "100%",
                }}
              >
                {" "}
                {ageOption.map((age) => (
                  <Select.Option value={age}>{age}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Diễn viên chính" name="cast">
              <input type="text" placeholder="Nhập diễn viên chính" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Đạo diễn" name="crew">
              <input type="text" placeholder="Nhập đạo diễn" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Nhà sản xuất" name="producer">
              <input type="text" placeholder="Nhập nhà sản xuất" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Poster URL" name="poster" rules={[{ required: true, message: "Hãy nhập ảnh nền của phim!" }]}>
              <input type="text" placeholder="URL" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Ảnh bìa URL" name="coverPoster" rules={[{ required: true, message: "Hãy nhập ảnh bìa của phim!" }]}>
              <input type="text" placeholder="URL" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Trailer URL" name="trailer" rules={[{ required: true, message: "Hãy nhập trailer!" }]}>
              <input type="text" placeholder="URL" />
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
                setShowMovieFormModal(false);
                setSelectedMovie(null);
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
              Xác nhận
            </Button>
          </ConfigProvider>
        </div>
      </Form>
    </Modal>
  );
};

export default MovieForm;
