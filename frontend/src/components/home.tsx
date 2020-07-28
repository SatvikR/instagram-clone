import React, { useState } from "react";
import { Container, Header, Icon, Image, Segment } from "semantic-ui-react";
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
  username: string;
}

const Post: React.FC<IProps> = ({
  title,
  owner,
  _id,
  image,
  likes,
  username,
}) => {
  React.useEffect(() => {
    console.log(username);
  }, [username]);
  return (
    <Segment raised>
      <Header as="h3" dividing>
        {title}
      </Header>
      <Image src={image} size="medium" bordered centered />
      <Header as="h4" dividing>
        Posted by: {username}
      </Header>
      <Header as="h4">
        <Icon name="thumbs up" />
        {likes}
      </Header>
    </Segment>
  );
};

const Home: React.FC = () => {
  const [posts, setPosts] = useState<any[] | null>();

  const getUsernames = async (posts: any) => {
    const nameMap = new Map();
    for (const post of posts) {
      const res = await api.get("/users/name/" + post.owner);
      const owner = post.owner;
      nameMap.set(owner, res.data.username);
      console.log(nameMap.get(owner));
    }
    return nameMap;
  };

  const createPosts = () => {
    api.get("/posts/all").then(async (res) => {
      const currPosts = res.data;
      currPosts.reverse();
      const nameMap = await getUsernames(currPosts);
      setPosts(
        currPosts.map((post: any) => {
          return (
            <Post
              title={post.title}
              owner={post.owner}
              _id={post._id}
              image={post.image}
              likes={post.likes}
              username={nameMap.get(post.owner)}
            />
          );
        })
      );
    });
  };

  React.useEffect(() => {
    createPosts();
  }, [createPosts]);

  return (
    <Container text textAlign="center">
      <Header as="h1" textAlign="center">
        <Icon name="image" /> Instagram Demo
      </Header>
      {posts || "loading"}
    </Container>
  );
};

export default Home;
