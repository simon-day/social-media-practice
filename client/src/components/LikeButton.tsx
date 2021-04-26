import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { Button, Icon, Label } from "semantic-ui-react";

interface Props {
  post: {
    id: string;
    likes: { username?: any }[];

    likeCount: number;
  };
  user: any;
}

const LikeButton: React.FC<Props> = ({ post, user }) => {
  const [liked, setLiked] = useState(false);

  const [likePost] = useMutation(LIKE_POST, { variables: { postId: post.id } });

  const onClickHandler = () => {
    likePost();
  };

  useEffect(() => {
    if (user && post.likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, post.likes]);

  const likeButton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to={"/login"} color="teal" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
    <Button as="div" labelPosition="right" onClick={onClickHandler}>
      {/* <Button color="teal" basic>
        <Icon name="heart" />
      </Button> */}
      {likeButton}
      <Label as="a" basic color="teal" pointing="left">
        {post.likeCount}
      </Label>
    </Button>
  );
};

export default LikeButton;

const LIKE_POST = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;
