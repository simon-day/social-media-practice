import React, { useContext } from "react";
import { Card, Image, Button, Icon, Label, Popup } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

interface Props {
  post: {
    body: string;
    createdAt: string;
    id: string;
    username: string;
    likeCount: number;
    commentCount: number;
    likes: Array<any>;
  };
}

const PostCard: React.FC<Props> = ({ post }) => {
  const context = useContext(AuthContext);
  const user: any = context.user;
  const {
    body,
    createdAt,
    id,
    username,
    likeCount,
    commentCount,
    likes,
  } = post;

  //   const likePost = () => {
  //     console.log("Like post");
  //   };

  const commentOnPost = () => {
    console.log("Comment on post");
  };

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow()}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ likeCount, likes, id }} />
        <Popup
          inverted
          content="Comment on post"
          trigger={
            <Button
              as={Link}
              to={`/posts/${id}`}
              labelPosition="right"
              onClick={commentOnPost}
            >
              <Button as="div" color="blue" basic>
                <Icon name="comments" />
              </Button>
              <Label basic color="blue" pointing="left">
                {commentCount}
              </Label>
            </Button>
          }
        />
        {user && user?.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
};

export default PostCard;
