import React from "react";
import { Grid, Header, Image, Button, Icon } from "semantic-ui-react";

interface IProps {
  title: string;
  _id: string;
  delete: (_id: string) => void;
  image: string;
  likes: number;
}

export const UserPost: React.FC<IProps> = ({
  title,
  _id,
  delete: del,
  image,
  likes,
}: IProps) => {
  return (
    <Grid celled verticalAlign="middle">
      <Grid.Row>
        <Grid.Column width={5} textAlign="center">
          <Header as="h2">{title}</Header>
          <Header as="h3">
            <Icon name="thumbs up outline" /> {likes}
          </Header>
        </Grid.Column>
        <Grid.Column width={6} textAlign="center">
          <Image size="medium" src={image} centered bordered />
        </Grid.Column>
        <Grid.Column width={5} textAlign="center">
          <Button
            icon="trash alternate"
            color="red"
            basic
            size="big"
            onClick={() => del(_id)}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};
