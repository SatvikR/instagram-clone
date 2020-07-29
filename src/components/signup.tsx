import React, { useState, useEffect } from "react";
import {
  Grid,
  Header,
  Icon,
  Form,
  Segment,
  Button,
  Message,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { cookies } from "../cookies";

const Signup: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeat, setRepeat] = useState<string>("");
  const [matching, setMatching] = useState<boolean>(true);

  useEffect(() => {
    setMatching(password === repeat);
  }, [password, repeat]);

  const handleSubmit = () => {
    if (matching) {
      api
        .post("/users/add", {
          username: username,
          password: password,
        })
        .then((res) => {
          cookies.set("token", res.data.accessToken);
          window.location.pathname = "/";
        })
        .catch((err: Error) => console.log(err));
    }
  };

  return (
    <Grid textAlign="center" style={{ height: "80vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        {!matching && (
          <Message warning>
            <Message.Header>Your Passwords Don't Match</Message.Header>
            <p>Please make sure your passwords match</p>
          </Message>
        )}
        <Header as="h2" textAlign="center">
          <Icon name="sign-in" /> Create an account
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Repeat Password"
              type="password"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
            />
            <Button color="black" fluid size="large" type="submit">
              Signup
            </Button>
          </Segment>
        </Form>
        <Message>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Signup;
