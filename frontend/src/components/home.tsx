import React, { useState, useEffect } from "react";
import {
  Container,
  Header,
  Icon,
  Image,
  Segment,
  Button,
  List,
  Form,
  Input,
} from "semantic-ui-react";
import { api } from "../api";
import { cookies } from "../cookies";

interface IComment {
  owner: string;
  text: string;
}

const Comment: React.FC<IComment> = ({ owner, text }) => {
  return (
    <List.Content>
      <List.Header as="h3" floated="left">
        <Icon name="comment outline" /> {owner}
      </List.Header>
      <p style={{ fontSize: "2vh" }}>{text}</p>
      <br />
    </List.Content>
  );
};

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
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<boolean>(false);
  const [comments, setComments] = useState<any[] | null>();
  const [showingComments, setShowingComments] = useState<boolean>(false);
  const [showingInput, setShowingInput] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>("");

  const getUsernames = async (posts: any) => {
    const nameMap = new Map();
    for (const post of posts) {
      const res = await api.get("/users/name/" + post.owner);
      const owner = post.owner;
      nameMap.set(owner, res.data.username);
    }
    return nameMap;
  };

  const getComments = React.useCallback(() => {
    api.get("/comments/get/" + _id).then(async (res) => {
      const currComments = res.data;
      currComments.reverse();
      const nameMap = await getUsernames(currComments);
      setComments(
        currComments.map((comment: any, index: number) => {
          return (
            <Comment
              owner={nameMap.get(comment.owner)}
              text={comment.text}
              key={index}
            />
          );
        })
      );
    });
  }, [_id]);

  useEffect(() => {
    getComments();
  }, [getComments]);

  useEffect(() => {
    if (cookies.get("token")) {
      api.get("/users/get").then((res) => {
        setLiked(res.data.liked.includes(_id));
        setFollowing(res.data.following.includes(owner));
      });
    }
    api
      .get("/users/followers/" + owner)
      .then((res) => setFollowers(res.data.followers));
  }, [_id, owner]);

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

  const handleFollow = () => {
    if (cookies.get("token")) {
      if (following) {
        api.post("/users/unfollow/" + owner);
        setFollowing(false);
        setFollowers(followers - 1);
      } else {
        api.post("/users/follow/" + owner);
        setFollowing(true);
        setFollowers(followers + 1);
      }
    } else {
      window.location.pathname = "/login";
    }
  };

  const handleAddComment = () => {
    if (!cookies.get("token")) {
      window.location.pathname = "/login";
    }
    setShowingInput(!showingInput);
  };

  const handleSubmitComment = () => {
    api.post("/comments/add", {
      post: _id,
      text: commentText,
    });
    api.get("/users/get").then((res) => {
      if (comments) {
        setComments([
          <Comment owner={res.data.username} text={commentText} />,
          ...comments,
        ]);
      }
      setShowingInput(false);
      setCommentText("");
      setShowingComments(true);
    });
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
        icon={following ? "check" : null}
        label={{
          basic: true,
          color: "orange",
          pointing: "left",
          content: followers || "...",
        }}
        onClick={handleFollow}
      />
      <Button
        color="blue"
        content="Show Comments"
        icon="comment outline"
        onClick={() => setShowingComments(!showingComments)}
      />
      <Button
        color="blue"
        content="Add a Comment"
        icon="plus"
        onClick={handleAddComment}
      />
      {showingInput && (
        <Form onSubmit={handleSubmitComment}>
          <br />
          <Form.Field>
            <Input
              placeholder="Comment goes here..."
              label="Comment: "
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <Button
              color="teal"
              content="Post Comment"
              icon="comment outline"
              type="submit"
            />
          </Form.Field>
        </Form>
      )}
      {showingComments && (
        <div style={{ textAlign: "left" }}>
          <br />
          <Header as="h3" dividing>
            Comments:
          </Header>
          <List divided relaxed>
            {comments || "Loading"}
          </List>
        </div>
      )}
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
