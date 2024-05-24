import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainView from "./components/main-view/main-view";
import Container from "react-bootstrap/Container";

// Import statement to indicate that you need to bundle ".index.scss"
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.scss";

// Main component (will eventually use all the others)
const MyFlixApplication =  () => {
  return <MainView />;
};

// Finds the root of your app
const container = document.querySelector("#root");
const root = createRoot(container);

// Tells React to render your app in the root DOM element
root.render(
  <StrictMode>
    <Container>
      <MyFlixApplication />
    </Container>
  </StrictMode>
);