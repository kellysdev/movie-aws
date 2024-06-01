import { useState, useEffect, useRef } from "react";
import { Button, Row, Col, Form, Image } from "react-bootstrap";

export const S3Images = ({  }) => {
  const [file, setFile] = useState(File | null); // file from fileForm input field
  const [profileImage, setProfileImage] = useState(file? fileName : "placeholder.png");
  const [bucketImages, setBucketImages] = useState([]); // all images from bucket

  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const [selectedImage, setSelectedImage] = useState(File | null)

  // this needs to be the image s3 bucket url
  const apiURL = process.env.IMAGES_BUCKET;

  // get all images from bucket
  useEffect(() => {
    if (showModal) {
      try {
        const allImages = fetch(`${apiURL}/images`);
        console.log(allImages);
        setBucketImages(allImages);
      } catch (error) {
        console.log("An error occurred fetching bucket images: " + error);
      }
    }
  }, [showModal]);

  // get resized images from bucket
  const thumbnails = bucketImages.filter(thumbnail => {
    return thumbnail.Key.includes("resized");
  })

  // get original images from bucket
  const originalImages = bucketImages.filter(image => {

  })

  // capture the file in the input field in fileForm
  const onFileChange = (event) => {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
  };

  // append file from state to formData and send formData to s3 bucket
  const submitImage = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      
      const resetFileInput = () => {
        inputRef.current.value = null;
      };

      try {
        const uploadResult = await fetch(`${apiURL}/images`, {
          method: "POST",
          body: formData,
        });
        console.log(uploadResult); // should be "Image uploaded successfully."
        resetFileInput();
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("Please select a file to upload.")
    }
  };

  return (
    <>
      <Row className="d-flex flex-column">
        <Col>
          <Image src={profileImage} rounded />
        </Col>

        <Col>
          <Form.Group className="fileForm">
            <Form.Label>Upload a profile picture:</Form.Label>
            <Form.Control type="file" size="sm" onChange={onFileChange} ref={inputRef} />
            <Button onClick={submitImage} variant="warning" size="sm">Submit</Button>
          </Form.Group>

          <Button onClick={showModal} variant="link" className="welcome-links">
            Or select an picture from the bucket
          </Button>
        </Col>
      </Row>

      <Modal show={openModal} onHide={closeModal} animation={false}>
        <Modal.Header>
          <Modal.Title>Select a profile picture:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {thumbnails.map((image, index) => {
            <img
              key={index}
              src={`${apiURL}/${image}`}
              className="img-thumbnail"
              onClick={setSelectedImage}
            />
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={setProfileImage} variant="warning">Submit Profile Picture</Button>
          <Button onClick={closeModal} variant="warning">Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
};