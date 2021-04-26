import React, { useState, useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

import { AuthContext } from "../../context/auth";

import { useForm } from "../../utils/hooks";

interface LoginProps {
  history: RouteComponentProps["history"];
}

const Login: React.FC<LoginProps> = (props) => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState<any>({});

  const [onChange, onSubmit, values] = useForm(loginUserCallback, {
    username: "",
    password: "",
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0]?.extensions?.exception.errors);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <Form.Input
          label="Username"
          placeholder="Username..."
          name="username"
          value={values.username}
          error={errors?.username ? true : false}
          onChange={onChange}
        />

        <Form.Input
          label="Enter Password"
          type="password"
          name="password"
          placeholder="Your password..."
          value={values.password}
          error={errors?.password ? true : false}
          onChange={onChange}
        />

        <Button type="submit" primary>
          Log in
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value: any) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
