import React, { useRef } from "react";
import { Modal, ConfigProvider } from "antd";
import ReactPlayer from "react-player/youtube.js";

const ModalVideo = ({ open, setOpen, url }) => {
  const playerRef = useRef(null); // Tạo một ref để tham chiếu đến ReactPlayer

  const handleCancel = () => {
    setOpen(false); // Đóng Modal
    if (playerRef.current) {
      playerRef.current.seekTo(0); // Quay lại thời điểm 0 của video
    }
  };

  return (
    <div>
     {/** */} <ConfigProvider
        theme={{
          components: {
            Modal: {
              paddingContentHorizontalLG: 0,
              paddingMD: 0,
            },
          },
        }}
      >
        <Modal
          open={open}
          onCancel={handleCancel}
          maskClosable={true}
          footer={null}
          title={null}
          width="80vw"
          closable={false}
        >
          {open && (
            <div className="w-full h-70">
              <ReactPlayer
                ref={playerRef} // Tham chiếu đến ReactPlayer
                url={url}
                controls={true}
                width="100%"
                height="100%"
              />
            </div>
          )}
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default ModalVideo;
