import React from "react";
import { Container, Header, Icon } from "semantic-ui-react";

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

//eslint-disable-nextline
const Post: React.FC<IProps> = ({ title, owner, _id, image, likes }) => {};

const Home: React.FC = () => {
  return (
    <Container text>
      <Header as="h1" textAlign="center">
        <Icon name="image" /> Instagram Demo
      </Header>
    </Container>
  );
};

export default Home;
