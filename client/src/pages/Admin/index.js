import React from "react";
import PageTitle from "../../components/PageTitle.js";
import { Tabs } from "antd";
import MovieList from "./MovieList.js";
import TheatresList from "./TheatresList.js";
import Checkin from "./Checkin.js";
import UserList from "./UserList.js";

const Admin = () => {
  return (
    <div className="w-95">
      <PageTitle title="Quản trị viên" />
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Phim" key="1">
          <MovieList />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Rạp chiếu" key="2">
          <TheatresList />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Check in" key="3">
          <Checkin />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Danh sách khách hàng " key="4">
          <UserList />
        </Tabs.TabPane>

      </Tabs>
    </div>
  );
};

export default Admin;
