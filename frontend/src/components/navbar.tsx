import React, { useState } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { cookies } from "../cookies";

const Navbar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("home");

  return (
    <Menu tabular color="violet">
      <Menu.Item
        as={Link}
        to="/"
        name="home"
        active={activeItem === "home"}
        onClick={() => setActiveItem("home")}
      />
      <Menu.Item
        as={Link}
        to="/following"
        name="following"
        active={activeItem === "following"}
        onClick={() => setActiveItem("following")}
      />
      <Menu.Item
        as={Link}
        to="/create-post"
        name="create a post"
        active={activeItem === "create"}
        onClick={() => setActiveItem("create")}
      />
      <Menu.Item
        as={Link}
        to="/account"
        name="your posts"
        active={activeItem === "account"}
        onClick={() => setActiveItem("account")}
      />
      <Menu.Menu position="right">
        <Menu.Item
          as={Link}
          to="/login"
          name={cookies.get("token") ? "logout" : "login"}
          active={activeItem === "login"}
          onClick={() => setActiveItem("login")}
        />
      </Menu.Menu>
    </Menu>
  );
};

export default Navbar;
