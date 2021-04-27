import React, { useState, useEffect, useContext } from "react";
import gql from "graphql-tag";
import { useSubscription } from "@apollo/client";
import { Message } from "semantic-ui-react";
import { AuthContext } from "../context/auth";

const Notification: React.FC<any> = () => {
  const context = useContext(AuthContext);
  const user: any = context.user;
  const [visible, setVisible] = useState(false);

  const { data } = useSubscription(POSTS_SUBSCRIPTION);

  useEffect(() => {
    if (data?.newPost && data?.newPost.username !== user?.username) {
      setVisible(true);
    }
  }, [data, user]);

  const handleDismiss = () => {
    setVisible(false);
  };

  if (!user) {
    return <div />;
  }

  if (visible) {
    const { username } = data?.newPost;

    return (
      <Message
        info
        onDismiss={handleDismiss}
        header="New post just added"
        content={`by ${username}`}
      />
    );
  } else {
    return <div />;
  }
};

const POSTS_SUBSCRIPTION = gql`
  subscription newPost {
    newPost {
      id
      username
      body
    }
  }
`;

export default Notification;
