import { useState, useEffect, useRef } from "react";
import { Button, Row, Col, Form, Image } from "react-bootstrap";

export const S3Images = ({  }) => {
  const [file, setFile] = useState(File | null); // file from fileForm input field or from image fetched from bucket from modal
  const [profileImage, setProfileImage] = useState(file? file.fileName : "placeholder.png");
  const [bucketImages, setBucketImages] = useState([]); // all images from bucket
  const [selectedImage, setSelectedImage] = useState(File | null); // image clicked on in modal

  // modal that displays thumbnails of all images in the bucket
  const [showBucketListModal, setShowBucketListModal] = useState(false);
  const openBucketListModal = () => setShowBucketListModal(true);
  const closeBucketListModal = () => setShowBucketListModal(false);

  // modal that will display the origianl image once its thumbnail is clicked on
  const [showImageModal, setShowImageModal] = useState(false);
  const openImageModal = () => setShowImageModal(true);
  const closeImageModal = () => setShowImageModal(false);

  // get list of images from bucket
  useEffect(() => {
    if (showBucketListModal) {
      try {
        const allImages = fetch(`${process.env.ALB_URL}/images`);
        console.log(allImages);
        setBucketImages(allImages);
      } catch (error) {
        console.log("An error occurred fetching bucket images: " + error);
      }
    }
  }, [showModal]);

  // generate thumbnail array
  const thumbnails = bucketImages.filter(image => {
    return image.Key,includes("resized");
  });

  // get name of original image
  const originalImage = selectedImage.replace("_resized.png", ".png");

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
        const uploadResult = await fetch(`${process.env.ALB_URL}/images`, {
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

  // get image from bucket
  const getImage = async () => {
    if (selectedImage) {
      const imageName = selectedImage.fileName;
      console.log("imageName from get request: " + imageName);

      try {
        const fetchedImage = await fetch(`${process.env.ALB_URL}/images/${imageName}`, {
          method: "GET"
        });
        console.log("fetched image:" + fetchedImage);


      } catch (error) {
        console.log("There was an error fetching the image: " + error);
      }
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

    {/* Thumbnail modal */}
      <Modal show={openShowBucketListModal} onHide={closeModal} animation={false}>
        <Modal.Header>
          <Modal.Title>Click on an image to view it in more deatil and to select it as your profile picture:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {thumbnails.map((thumbnail, index) => {
            <img
              key={index}
              src={`${apiURL}/${thumbnail.Key}`}
              alt={`Thumbnail of ${thumbnail.Key}`}
              className="img-thumbnail"
              onClick={setSelectedImage}
            />
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={getImage} variant="warning">Set Profile Picture</Button>
          <Button onClick={closeBucketListModal} variant="warning">Close</Button>
        </Modal.Footer>
      </Modal>

      {/* individual image modal */}
      <Modal show={openImageModal} onHide={closeImageModal} animation={false}>
        <Modal.Body>
          <img
            src={originalImage}
            alt={originalImage}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeImageModal} variant="warning">Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
};