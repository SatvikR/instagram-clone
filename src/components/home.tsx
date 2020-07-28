import React, { useState, useEffect } from "react";
import {
  Container,
  Header,
  Icon,
  Image,
  Segment,
  Button,
} from "semantic-ui-react";
import { api } from "../api";
import { cookies } from "../cookies";

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
  const [liked, setLiked] = useState<boolean>(false);
  const [currLikes, setCurrLikes] = useState<number>(likes);

  useEffect(() => {
    if (cookies.get("token")) {
      api.get("/users/get").then((res) => {
        setLiked(res.data.liked.includes(_id));
      });
    }
  }, []);

  const handleLike = () => {
    if (cookies.get("token")) {
      if (liked) {
        api.post("/posts/dislike/" + _id);
        setLiked(false);
        setCurrLikes(currLikes - 1);
      } else {
        api.post("/posts/like/" + _id);
        setLiked(true);
        setCurrLikes(currLikes + 1);
      }
    } else {
      window.location.pathname = "/login";
    }
  };

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
      <Button
        color="green"
        content="Likes"
        icon={liked ? "check" : "thumbs up"}
        label={{
          basic: true,
          color: "green",
          pointing: "left",
          content: currLikes,
        }}
        onClick={handleLike}
      />
      <Button
        color="orange"
        content="Followers"
        label={{
          basic: true,
          color: "orange",
          pointing: "left",
          content: 10,
        }}
      />
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

  const createPosts = React.useCallback(() => {
    api.get("/posts/all").then(async (res) => {
      const currPosts = res.data;
      currPosts.reverse();
      const nameMap = await getUsernames(currPosts);
      setPosts(
        currPosts.map((post: any, i: number) => {
          console.log(post.likes);
          return (
            <Post
              title={post.title}
              owner={post.owner}
              _id={post._id}
              image={post.image}
              likes={post.likes}
              username={nameMap.get(post.owner)}
              key={i}
            />
          );
        })
      );
    });
  }, []);

  React.useEffect(() => {
    createPosts();
  }, [createPosts]);

  return (
    <Container text textAlign="center">
      <Header as="h1" textAlign="center">
        <Icon name="image" /> Instagram Demo
      </Header>
      {posts || (
        <Segment loading>
          <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
        </Segment>
      )}
    </Container>
  );
};

export default Home;
