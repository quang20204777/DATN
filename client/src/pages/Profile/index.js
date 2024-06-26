import React from "react";
import PageTitle from "../../components/PageTitle";
import { Tabs } from "antd";
import Bookings from "./Bookings.js";
import ProfileDetail from "./ProfileDetail.js";
import  {useSelector} from 'react-redux';
const Profile = () => {
  const { user } = useSelector((state) => state.users);
  
  return (
    <div className="w-95">
      <PageTitle title="Thông tin cá nhân" />

      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Booking" key="1">
          <Bookings />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Thông tin" key="2">
          <div className="flex justify-center">
            <ProfileDetail user={user}/>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Profile;
