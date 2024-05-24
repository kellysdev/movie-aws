import { Navbar, Container, Nav, NavbarBrand, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

export const NavigationBar = ({ user, onLoggedOut }) => {
  return (
    <Navbar expand="sm" bg="light">
      <Container>
        <Navbar.Brand to="/">PopOpolis</Navbar.Brand>
        <Nav className="container-fluid">
          {!user && (
            <>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
            </>
          )}
          {user && (
            <>
              <Nav className="container-fluid">
                <Nav.Link as={Link} to="/" className="ml-auto">Home</Nav.Link>
                <Nav.Link as={Link} to="/profile" className="ml-auto">Profile</Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link onClick={onLoggedOut}>Logout</Nav.Link>
              </Nav>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};