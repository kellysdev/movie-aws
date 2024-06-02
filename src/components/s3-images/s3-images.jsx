import { useState, useEffect, useRef } from "react";
import { Button, Row, Col, Form, Image, Modal } from "react-bootstrap";

export const S3Images = ({  }) => {
  const [file, setFile] = useState(File | null); // file from fileForm input field or from image fetched from bucket from modal
  const [profileImage, setProfileImage] = useState(file? file.name : "placeholder.png");
  const [bucketImages, setBucketImages] = useState([]); // all images from bucket
  const [thumbnails, setThumbnails] = useState([""]); // thumbnails filtered from all images
  const [selectedImage, setSelectedImage] = useState(""); // thumbnail clicked on in modal

  // modal that displays thumbnails of all images in the bucket
  const [showBucketListModal, setShowBucketListModal] = useState(false);
  const openBucketListModal = () => setShowBucketListModal(true);
  const handleCloseBuckettModal = () => setShowBucketListModal(false);

  // modal that will display the origianl image once its thumbnail is clicked on
  const [showImageModal, setShowImageModal] = useState(false);
  const openImageModal = (thumbnail) => {
    setShowImageModal(true);
    setSelectedImage(thumbnail);
  };
  const closeImageModal = () => setShowImageModal(false);

  const inputRef = useRef("");

  // get list of images from bucket
  useEffect(() => {
    if (showBucketListModal) {
      try {
        fetch(`${process.env.ALB_URL}/images`, {
          method: "GET"
        })
        .then(response => response.json())
        .then(data =>{
          // get list of image names
          const allImages = data.Contents.map(image => image.Key);
          setBucketImages(allImages);
          console.log(bucketImages);

          // filter out resized images
          const resizedImages = bucketImages.filter(images => images.includes("resized"));
          setThumbnails(resizedImages);
          console.log(thumbnails);
        })
      } catch (error) {
        console.log("An error occurred fetching bucket images: " + error);
      }
    }
  }, [showBucketListModal]);

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
          <img className="profile-picture" src={profileImage} rounded />
        </Col>

        <Col>
          <Form.Group className="fileForm">
            <Form.Label>Upload a profile picture:</Form.Label>
            <Form.Control type="file" size="sm" onChange={onFileChange} ref={inputRef} />
            <Button onClick={submitImage} variant="warning" size="sm">Submit</Button>
          </Form.Group>

          <Button onClick={openBucketListModal} variant="link" className="welcome-links">
            Or select a picture from the bucket
          </Button>
        </Col>
      </Row>

    {/* Thumbnail modal */}
      <Modal show={showBucketListModal} onHide={handleCloseBuckettModal} animation={false}>
        <Modal.Header>
          <Modal.Title>Click on a picture to view it in more detail.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bucketImages.length === 0 ? (
            <p>There are no images in the bucket.</p>
          ) : (
            thumbnails.map((thumbnail, index) => {
              <img
                key={index}
                src={`${process.env.IMAGES_BUCKET}/original-images/${thumbnail}`}
                alt={`Thumbnail of ${thumbnail}`}
                className="img-thumbnail"
                onClick={openImageModal(thumbnail)}
              />
            })
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseBuckettModal} variant="warning">Close</Button>
        </Modal.Footer>
      </Modal>

      {/* individual image modal */}
      <Modal show={showImageModal} onHide={closeImageModal} animation={false}>
        <Modal.Body>
          <img
            src={selectedImage.replace("_resized.png", ".png")}
            alt={selectedImage.replace("_resized.png", ".png")}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={setFile} variant="warning">Set as Profile Picture</Button>
          <Button onClick={closeImageModal} variant="warning">Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
};