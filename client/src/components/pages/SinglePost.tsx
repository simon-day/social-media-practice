import React, { useContext, useState, useRef } from "react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import {
  Card,
  Grid,
  Image,
  Button,
  Icon,
  Label,
  Form,
} from "semantic-ui-react";
import moment from "moment";
import LikeButton from "../LikeButton";
import DeleteButton from "../DeleteButton";
import { AuthContext } from "../../context/auth";

type CommentProps = {
  id: string;
  username: string;
  createdAt: string;
  body: string;
};

const SinglePost: React.FC<any> = (props) => {
  const context = useContext(AuthContext);
  const user: any = context.user;
  const commentInputRef = useRef<HTMLInputElement>(null);

  const postId = props.match.params.postId;

  const { data: { getPost } = {} } = useQuery(FETCH_POST, {
    variables: {
      postId,
    },
  });

  const [comment, setComment] = useState("");

  const [createComment] = useMutation(CREATE_COMMENT, {
    update() {
      setComment("");
      commentInputRef.current?.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  const createCommentHandler = () => {
    createComment();
  };

  const deletePostCallback = () => {
    props.history.push("/");
  };

  let postMarkup;

  if (!getPost) {
    postMarkup = <p>Loading post...</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPost;

    postMarkup = (
      <Grid style={{ marginTop: 20 }}>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated="right"
              size="small"
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                <Button
                  as="div"
                  labelPosition="right"
                  onClick={() => console.log("comment on post")}
                >
                  <Button basic color="blue">
                    <Icon name="comments" />
                  </Button>
                  <Label basic color="blue" pointing="left">
                    {commentCount}
                  </Label>
                </Button>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <h3>Post a comment:</h3>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Enter your comment..."
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ""}
                        onClick={createCommentHandler}
                      >
                        Post
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment: CommentProps) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
};

const FETCH_POST = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
