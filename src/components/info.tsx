import React from "react";
import { Segment, Header, Icon } from "semantic-ui-react";

interface IProps {
  username?: string;
  following?: number;
  followers?: number;
}

export const Info: React.FC<IProps> = ({ username, following, followers }) => {
  return (
    <Segment raised textAlign="center">
      <Header as="h1" dividing>
        Your Account:
      </Header>
      <Header as="h2">
        <Icon name="user" /> {username}
      </Header>
      <br />
      <Header as="h2" floated="left" style={{ marginLeft: "15%" }}>
        Following: {following}
      </Header>
      <Header as="h2" floated="right" style={{ marginRight: "15%" }}>
        Followers: {followers}
      </Header>
      <br />
      <br />
    </Segment>
  );
};
