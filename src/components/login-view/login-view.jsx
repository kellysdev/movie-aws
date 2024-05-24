import React, { useEffect } from "react";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Link }from "react-router-dom";
import { Logo } from "../logo/logo.jsx";

export const LoginView = ({ onLoggedIn }) => {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    if (!token || !storedUsername) return;

    fetch("http://MovieLoadBalancer-598921563.us-west-2.elb.amazonaws.com/users/" + storedUsername, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"  }
    })
    .then(response => response.json())
    .then(data => {
      onLoggedIn(data, token);
    });
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      Username: Username,
      Password: Password
    }

    fetch("MovieLoadBalancer-598921563.us-west-2.elb.amazonaws.com/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.user) {
        localStorage.setItem("username", data.user.Username);
        localStorage.setItem("token", data.token);
        onLoggedIn(data.user, data.token);
      } else {
        alert("No such user");
      }
    })
    .catch((e) => {
      alert("Something went wrong");
    })
  };

  const guestLogin = (event) => {
    event.preventDefault();

    const data = {
      Username: "guest",
      Password: "guest"
    }

    fetch("MovieLoadBalancer-598921563.us-west-2.elb.amazonaws.com/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.user) {
        localStorage.setItem("username", data.user.Username);
        localStorage.setItem("token", data.token);
        onLoggedIn(data.user, data.token);
      } else {
        alert("No such user");
      }
    })
    .catch((e) => {
      alert("Something went wrong");
    })
  };

  return (
    <>
      <Logo />

      <Form onSubmit={handleSubmit}>

        <Form.Group controlId="formUsername">
          <Form.Control 
            type="text"
            value={Username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength="3"
          />
        </Form.Group>
        
        <Form.Group controlId="formPassword">
          <Form.Control className="mt-3"
            type="password"
            value={Password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Container className="welcome-buttons mt-3">
          <Button type="submit" variant="warning" className="">Login</Button>
        </Container>
        <Container className="d-grid">
          <Link className="welcome-links mt-3" to="/signup">
            Don't have an account?
          </Link>
        </Container>
        <Container className="d-grid">
          <Button onClick={guestLogin} className="btn-link welcome-links guest-login">Login as a Guest</Button>
        </Container>

      </Form>
    </>
  )
};