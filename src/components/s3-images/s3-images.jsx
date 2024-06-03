import { useState, useEffect, useRef } from "react";
import { Button, Row, Col, Form, Image, Modal } from "react-bootstrap";

export const S3Images = ({  }) => {
  const [file, setFile] = useState(null); // file from fileForm input field
  const [profileImage, setProfileImage] = useState("");
  const [bucketImages, setBucketImages] = useState([]); // all images from bucket
  const [thumbnails, setThumbnails] = useState([]); // thumbnails filtered from all images
  const [selectedImage, setSelectedImage] = useState(""); // thumbnail clicked on in modal

  // displays thumbnails of all images in the bucket
  const [showBucketList, setShowBucketList] = useState(false);
  const openBucketList = () => setShowBucketList(true);
  const handleCloseBucket = () => setShowBucketList(false);

  // modal that will display the origianl image once its thumbnail is clicked on
  const [showImageModal, setShowImageModal] = useState(false);
  const openImageModal = (thumbnail) => {
    setShowImageModal(true);
    setSelectedImage(thumbnail);
  };
  const closeImageModal = () => setShowImageModal(false);

  const inputRef = useRef(null);

  // get list of images from bucket
  useEffect(() => {
    if (showBucketList) {
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
          console.log(resizedImages);
        });
      } catch (error) {
        console.log("An error occurred fetching bucket images: " + error);
      }
    }
  }, [showBucketList]);

  // capture the file in the input field in fileForm
  const onFileChange = (event) => {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
  };

  // append file from state to formData and send formData to s3 bucket
  const submitImage = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      
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

  return (
    <>
      <Row className="d-flex flex-column">
        <Col >
          {profileImage === "" ? (
            <img className="profile-picture" src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" alt="placeholder profile picture" />
          ) : (
            <img className="profile-picture" src={`${process.env.IMAGES_BUCKET}/${profileImage}`} />
          )}
        </Col>

        <Col>
          <Form.Group className="fileForm">
            <Form.Label>Upload a profile picture:</Form.Label>
            <Form.Control type="file" size="sm" onChange={onFileChange} ref={inputRef} />
            <Button onClick={submitImage} variant="warning" size="sm">Submit</Button>
          </Form.Group>

          <Button onClick={openBucketList} variant="link" className="welcome-links">
            Or select a picture from the bucket
          </Button>
        </Col>

        {showBucketList && (
          <>
            <Col>
              <p>Click on a picture to view it in more detail.</p>
            </Col>
            <Col className="d-flex" xs={3}>
                {bucketImages.length === 0 ? (
                  <p>There are no images in the bucket.</p>
                ) : (
                  thumbnails.map((thumbnail, index) => {
                    return <img
                      key={index}
                      src={`${process.env.IMAGES_BUCKET}/${thumbnail}`}
                      alt={`Thumbnail of ${thumbnail}`}
                      className="bucket-thumbnails"
                      onClick={() => openImageModal(thumbnail)}
                    />
                  })
                )}

            </Col>
            <Col>
              <Button onClick={handleCloseBucket} variant="warning" className="">Close</Button>
            </Col>
          </>
        )}
      </Row>

      {/* individual image modal */}
      <Modal show={showImageModal} onHide={closeImageModal} animation={false}>
        <Modal.Body>
          <img
            src={`${process.env.IMAGES_BUCKET}/${selectedImage.replace("resized", "original-images")}`}
            alt={selectedImage.replace("resized", "")}
            className="modal-image"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setProfileImage(selectedImage.replace("resized", "original-images"))} variant="warning">Set as Profile Picture</Button>
          <Button onClick={closeImageModal} variant="warning">Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
};