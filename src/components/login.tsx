import React, { useState, useEffect } from "react";
import {
  Grid,
  Header,
  Icon,
  Form,
  Segment,
  Button,
  Message,
  Loader,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { cookies } from "../cookies";
import { api } from "../api";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [currUser, setCurrUser] = useState<string | null>();

  useEffect(() => {
    if (cookies.get("token")) {
      api.get("/users/get").then((res) => {
        setCurrUser(res.data.username);
      });
    }
  }, []);

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    api
      .get("/users/login/", {
        data: { username: username, password: password },
      })
      .then((res) => {
        cookies.set("token", res.data.accessToken);
        window.location.pathname = "/following";
      })
      .catch((err) => console.log(err));
  };

  const handleLogout = () => {
    cookies.remove("token");
    window.location.pathname = "/";
  };

  if (cookies.get("token")) {
    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" textAlign="center">
            You are currently logged in as{" "}
            {currUser || <Loader active inline />}
          </Header>
          <Header as="h2" textAlign="center">
            <Icon name="log out" /> Log-out of your account
          </Header>
          <Form size="large" onSubmit={handleLogout}>
            <Button color="black" fluid size="large" type="submit">
              Logout
            </Button>
          </Form>
        </Grid.Column>
      </Grid>
    );
  } else {
    return (
      <Grid
        textAlign="center"
        style={{ height: "80vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" textAlign="center">
            <Icon name="sign-in" /> Login to your account
          </Header>
          <Form size="large" onSubmit={handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Username"
                value={username}
                onChange={handleUsername}
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                value={password}
                onChange={handlePassword}
              />

              <Button color="black" fluid size="large" type="submit">
                Login
              </Button>
            </Segment>
          </Form>
          <Message>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
};

export default Login;
