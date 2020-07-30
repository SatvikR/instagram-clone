import React, { useEffect, useState } from "react";
import { Container, Segment, Image, Header } from "semantic-ui-react";
import { cookies } from "./shared/cookies";
import { api } from "./shared/api";
import { Info } from "./account/info";
import { UserPost } from "./account/user-post";

const Account: React.FC = () => {
  const [info, setInfo] = useState<any | null>();
  const [posts, setPosts] = useState<any[] | null>();

  const handleDelete = React.useCallback((_id: string) => {
    api.delete("/posts/" + _id).then((_res) => createPosts());
    // eslint-disable-next-line
  }, []);

  const createPosts = React.useCallback(() => {
    api.get("/posts").then(async (res) => {
      const currPosts = res.data;
      currPosts.reverse();
      setPosts(
        currPosts.map((post: any, i: number) => {
          console.log(post.likes);
          return (
            <UserPost
              title={post.title}
              _id={post._id}
              key={i}
              image={post.image}
              delete={handleDelete}
              likes={post.likes}
            />
          );
        })
      );
    });
  }, [handleDelete]);

  useEffect(() => {
    if (!cookies.get("token")) {
      window.location.pathname = "/login";
    }

    api.get("/users/get").then((res_one) => {
      api.get("/users/followers/" + res_one.data._id).then((res) => {
        setInfo({
          username: res_one.data.username,
          following: res_one.data.following.length,
          followers: res.data.followers,
        });
      });
    });
  }, []);

  useEffect(() => {
    createPosts();
  }, [createPosts]);

  return (
    <>
      <Container text>
        {!info && (
          <Segment loading>
            <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
          </Segment>
        )}
        {info && (
          <Info
            username={info.username}
            following={info.following}
            followers={info.followers}
          />
        )}
      </Container>
      <Header as="h2" textAlign="center">
        Your Posts:
      </Header>
      <Container>
        {posts || (
          <Segment loading>
            <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
          </Segment>
        )}
      </Container>
    </>
  );
};

export default Account;
