import { useState } from "react";
import { Button, Row, Col, Form, Image } from "react-bootstrap";

export const S3Images = ({  }) => {
  const [profileImage, setProfileImage] = useState("");

  const submitImage = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Row className="d-flex flex-column">
        <Col>
          <Image src={profileImage} rounded />
        </Col>

        <Col>
          <Form.Group className="formFile">
            <Form.Label>Upload a profile picture:</Form.Label>
            <Form.Control type="file" size="sm" />
            <Button onClick={submitImage} variant="warning" size="sm">Submit</Button>
          </Form.Group>
        </Col>
      </Row>
    </>
  )
};