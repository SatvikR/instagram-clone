import React from "react";
import { Container, Header, Icon } from "semantic-ui-react";
import { api } from "../api";

interface IComment {
  owner: string;
  text: string;
}

interface IProps {
  title: string;
  owner: string;
  _id: string;
  image: string;
  likes: number;
}

// const Post: React.FC<IProps> = ({ title, owner, _id, image, likes }) => {};

const Home: React.FC = () => {
  const createPosts = () => {
    api.get("/posts/all").then((res) => console.log(res.data));
  };

  return (
    <Container text>
      <Header as="h1" textAlign="center">
        <Icon name="image" /> Instagram Demo
      </Header>
      {createPosts()}
    </Container>
  );
};

export default Home;
