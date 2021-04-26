import React, { useState, useContext } from "react";
import { Menu, MenuItemProps } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth";

const MenuBar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const { pathname } = useLocation();
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState<string | undefined>(path);

  const handleItemClick = (e: React.MouseEvent, data: MenuItemProps) => {
    setActiveItem(data.name);
  };

  const menuBar = user ? (
    <div>
      <Menu pointing secondary size="massive" color="teal">
        {/* @ts-ignore */}
        <Menu.Item name={user.username} active as={Link} to="/" />
        <Menu.Menu position="right">
          <Menu.Item name="logout" onClick={logout} />
        </Menu.Menu>
      </Menu>
    </div>
  ) : (
    <div>
      <Menu pointing secondary size="massive" color="teal">
        <Menu.Item
          name="home"
          active={activeItem === "home"}
          onClick={handleItemClick}
          as={Link}
          to="/"
        />

        <Menu.Menu position="right">
          <Menu.Item
            name="login"
            active={activeItem === "login"}
            onClick={handleItemClick}
            as={Link}
            to="/login"
          />
          <Menu.Item
            name="register"
            active={activeItem === "register"}
            onClick={handleItemClick}
            as={Link}
            to="/register"
          />
        </Menu.Menu>
      </Menu>
    </div>
  );

  return menuBar;
};

export default MenuBar;
