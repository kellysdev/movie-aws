import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import { Logo } from "../logo/logo.jsx";

export const SignupView = () => {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [Email, setEmail] = useState("");
  const [Birthday, setBirthday] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      Username: Username,
      Password: Password,
      Email: Email,
      Birthday: Birthday
    };
  
    fetch("MovieLoadBalancer-598921563.us-west-2.elb.amazonaws.com/users", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => {
      if (response.ok) {
        alert("Signup successful");
        window.location.reload();
      } else {
        alert("Signup failed");
      }
    })
  };


  return (
    <>
      <Logo />

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Control
          type="text"
          value={Username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength = "3"
          />
        </Form.Group>

        <Form.Group>
          <Form.Control className="mt-3"
          type="password"
          value={Password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
          />
        </Form.Group>

        <Form.Group>
          <Form.Control className="mt-3"
          type="email"
          value={Email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          />
        </Form.Group>

        <Form.Group>
          <Form.Control className="mt-3"
          // type="date"
          value={Birthday}
          placeholder="Birthday"
          onChange={(e) => setBirthday(e.target.value)}
          required
          />
        </Form.Group>

        <Container className="welcome-buttons mt-3">
          <Button type="submit" variant="warning">Signup</Button>
        </Container>
        <Container className="d-grid">
          <Link className="welcome-links mt-3" to="/login">
            Already have an account?
          </Link>
        </Container>
      </Form>
    </>
  )
};