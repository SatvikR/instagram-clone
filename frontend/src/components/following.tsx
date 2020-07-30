import React, { useEffect, useState } from "react";
import { cookies } from "../cookies";
import { api } from "../api";
import { Post } from "./post";
import { Container, Header, Icon, Segment, Image } from "semantic-ui-react";

const Following: React.FC = () => {
  const [posts, setPosts] = useState<any[] | null>();

  const getUsernames = async (posts: any) => {
    const nameMap = new Map();
    for (const post of posts) {
      const res = await api.get("/users/name/" + post.owner);
      const owner = post.owner;
      nameMap.set(owner, res.data.username);
    }
    return nameMap;
  };

  const createPosts = React.useCallback(() => {
    api.get("/posts/following").then(async (res) => {
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

  useEffect(() => {
    if (!cookies.get("token")) {
      window.location.pathname = "/login";
    }
    createPosts();
  }, [createPosts]);

  return (
    <Container text textAlign="center">
      <Header as="h1" textAlign="center">
        <Icon name="image" /> Following:
      </Header>
      {posts || (
        <Segment loading>
          <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
        </Segment>
      )}
    </Container>
  );
};

export default Following;
