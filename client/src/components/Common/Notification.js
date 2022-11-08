import React, { useContext, useEffect, useState } from "react";

import {
  BellTwoTone,
  ClockCircleOutlined,
  EditOutlined,
  SnippetsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Badge, message, Avatar, List, Dropdown, Menu } from "antd";
import "../../styles/notification.css";
import { serverURL } from "../../configs/server.config";
import VirtualList from "rc-virtual-list";
import { UserContext } from "../User/UserProvider";
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router-dom";
const ContainerHeight = 200;
const initialNoti = [
  {
    _id: 1,
    title: "title1",
    type: "infor",
    status: false,
    content: "content2",
  },
  {
    _id: 2,
    title: "title2",
    type: "apply",
    status: false,
    content: "content2",
  },
];

export const Notification = () => {
  const [noti, setNoti] = useState(initialNoti);

  const setLabel = () => {
    if (noti.length) {
      //   return noti.length;
      return (
        <List className="list-noti">
          <VirtualList
            data={noti}
            height={ContainerHeight}
            itemHeight={47}
            // itemKey="email"
            // onScroll={onScroll}
          >
            {(item) => (
              <List.Item
                key={item._id || "empty"}
                style={
                  item.status
                    ? { background: "gray" }
                    : { background: "transparent" }
                }
              >
                <List.Item.Meta
                  avatar={
                    <Badge
                      count={
                        item.type === "infor" ? (
                          <SnippetsOutlined
                          //   style={{
                          //     color: "",
                          //   }}
                          />
                        ) : (
                          <EditOutlined />
                        )
                      }
                    >
                      <Avatar shape="circle" icon={<UserOutlined />} />
                    </Badge>
                  }
                  title={item.title || "hi"}
                  description={item.content || "hi"}
                />
                <div>Content</div>
              </List.Item>
            )}
          </VirtualList>
        </List>
      );
    } else {
      return "Không có thông báo nào!";
    }
  };
  const items = [
    {
      label: setLabel(),
      key: "item-1",
    },
  ];

  const [count, setCount] = useState(10);
  const { user, token, changeUser } = useContext(UserContext);
  const [account, setAccount] = useState(user);
  const navigate = useNavigate();

  const fetchNoti = async () => {
    if (account) {
      const url = serverURL + "noti/" + account._id;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        console.log(result);
        if (response.status !== 200) {
          message.error(result.message);
        } else {
          console.log("fetchField", result.data);
          if (result.data.length) {
            setNoti([...result.data]);
          }
          //   setNoti([]);
        }
      } catch (err) {
        console.log(err);
        message.error("Đã có lỗi xảy ra!");
      }
    }
  };
  //fetch user
  const fetchUser = async () => {
    console.log("fetch user account");
    const tokenx = token ? token : window.localStorage.getItem("accessToken");
    console.log("tokenx", tokenx);
    const id = decodeToken(tokenx).sub;
    console.log("id", id);
    const url = serverURL + "account/" + id;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.status !== 200) {
        message.error("Lỗi hệ thống load user!");
      } else {
        console.log("user fetch to set role", result);
        if (!result) {
          message.warn("Bạn ko có quyền xem trang này");
          navigate("/");
        }
        changeUser({ ...result });
        setAccount({ ...result });
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  //   useEffect(() => {
  //     fetchNoti();
  //   }, [account]);
  // const onScroll = (e) => {
  //     if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === ContainerHeight) {
  //       appendData();
  //     }
  //   };

  const Notifications = <Menu className="menu-account" items={items} />;
  return (
    <>
      <Dropdown
        overlay={Notifications}
        placement="bottom"
        arrow={{
          pointAtCenter: true,
        }}
      >
        <div className="notification">
          <Badge count={count} overflowCount={99}>
            <BellTwoTone className="icon-bell" />
          </Badge>
        </div>
      </Dropdown>
    </>
  );
};
