
import React from "react";
import "./Header.css";
import { Link, useLocation } from "react-router-dom";
import Auth from "../../utils/auth";
import { Button } from "@mui/material";

function Header(props) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  const { handleChanges, handleSubmit } = props;

  return (
    <header>
      <div className="title-container">
        <h1>StreamVerse</h1>
      </div>
      <div className="button-container">
        {Auth.loggedIn() ? (
          <>
            <Link to="/logout" onClick={logout}>
              <Button
                variant="outlined"
                sx={{ color: "black", borderColor: "black" }}
              >
                Logout
              </Button>
            </Link>
            {isHomePage && (
              <Link to="/profile">
                <Button
                  variant="outlined"
                  sx={{ color: "black", borderColor: "black" }}
                >
                  Go to StreamVerse
                </Button>
              </Link>
            )}
          </>
        ) : (
          <>
            <Link to="/login">
              <Button
                variant="outlined"
                color="secondary"
                sx={{ color: "black", borderColor: "black" }}
              >
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                variant="outlined"
                color="secondary"
                sx={{ color: "black", borderColor: "black" }}
              >
                Signup
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;


