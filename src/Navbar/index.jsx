import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { useMenuItem } from "./menuItems";
import { selectMenuItem } from "Redux/Actions/SelectMenuItem";
import { useTheme } from "@material-ui/core/styles";
import "./style.css";

export default function Header() {
  const menuList = useMenuItem();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Menu
      mode="horizontal"
      defaultSelectedKeys={["Home"]}
      style={{
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        position: "sticky",
        top: 0,
        zIndex: 2,
      }}
      theme="light"
    >
      {menuList.map((item, index) =>
        item.submenu ? (
          <Menu.SubMenu
            key={index + item.title}
            title={item.title}
            icon={item.Icon}
          >
            {item.submenu.map((childItem) => (
              <Menu.Item
                onClick={() => {
                  dispatch(selectMenuItem(childItem.title));
                  navigate(childItem.to);
                }}
                key={childItem.title}
              >
                {childItem.title}
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ) : (
          <Menu.Item
            onClick={() => {
              dispatch(selectMenuItem(item.title));
              navigate(item.to);
            }}
            key={item.title}
            icon={item.Icon}
          >
            {item.title}
          </Menu.Item>
        )
      )}
    </Menu>
  );
}
