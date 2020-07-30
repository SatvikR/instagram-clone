import React from "react";
import { List, Icon } from "semantic-ui-react";

interface IComment {
  owner: string;
  text: string;
}

export const Comment: React.FC<IComment> = ({ owner, text }) => {
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
