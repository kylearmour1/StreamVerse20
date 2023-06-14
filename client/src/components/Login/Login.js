import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../graphql/mutations";
import { useHistory, Link } from "react-router-dom";
import "./Login.css";
import Auth from "../../utils/auth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const [login] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await login({
        variables: { username, password },
      });
      Auth.login(data.login.token);
      history.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="login-container">
      <h2>StreamVerse Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            className="login-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password:
          <br />
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="login-button" type="submit">
          Login
        </button>
      </form>
      <p>
        Do not have an account?{" "}
        <Link to="/signup" className="signup-link">
          Signup here!
        </Link>
      </p>
    </div>
  );
};

export default Login;
