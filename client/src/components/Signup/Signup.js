import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { NEW_USER_MUTATION } from "../graphql/mutations";
import "./Signup.css";
import Auth from "../../utils/auth";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
  });

  const [signUp, { error, data }] = useMutation(NEW_USER_MUTATION);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await signUp({
        variables: { ...formData },
      });

      Auth.login(data.addUser.token);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        {data ? (
          <p>
            Success! You may now head <Link to="/">back to the homepage.</Link>
          </p>
        ) : (
          <div className="signUp-container">
            <h1 className="center">Ready to start free trial?</h1>

            <p className="center">
              Fill out the information below and create your StreamVerse
              account!
            </p>
            <form onSubmit={handleSubmit}>
              <label>
                First Name:
                <input
                  className="input-field firstName-input"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </label>
              <label>
                Last Name:
                <input
                  className="input-field lastName-input"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </label>
              <label>
                Username:
                <input
                  className="input-field username-input"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                />
              </label>
              <label>
                Password:
                <input
                  className="input-field password-input"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </label>
              <label>
                Email:
                <input
                  className="input-field email-input"
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>
              <button className="submit center" type="submit">
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
      {error && <div>Something went wrong..</div>}
    </div>
  );
};

export default SignUp;
