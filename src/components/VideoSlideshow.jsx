import React, { useState } from "react";
import { Form, Image, Alert } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import { getdomain } from "../utils";

const ItemType = "IMAGE";

const DraggableImage = ({ image, index, moveImage, handleRemove }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveImage(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "10px",
      }}
    >
      <Image
        src={image.id}
        rounded
        thumbnail
        style={{ width: "100px", height: "100px" }}
        // className="w-100 h-100"
      />

      <ButtonGroup aria-label="Third group">
        <Button
          onClick={() => handleRemove(index)}
          size="sm"
          style={{
            backgroundColor: "white",
            color: "red",
            border: "1px solid red",
            borderRadius: "50%",
            textAlign: "center",
            padding: "2px",
            fontSize: "12px",
            width: "25px",
            height: "25px",
            marginTop: "5px", // Added margin-top
          }}
        >
          X
        </Button>
      </ButtonGroup>
    </div>
  );
};

const VideoSlideshow = () => {
  const [duration, setDuration] = useState("3");
  const [music, setMusic] = useState("Classical");
  const [effect, setEffect] = useState("Zoom In");
  const [images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [videoUrl, setVideoUrl] = useState(null); // To store the video URL

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 6) {
      setErrorMessage("You can upload a maximum of 6 images.");
      return;
    }

    const newImages = files.map((file) => ({
      id: URL.createObjectURL(file),
      file: file,
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
    setErrorMessage(""); // Reset error message on successful upload
  };

  // Handle removing an image
  const handleRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  // Handle drag-and-drop reordering
  const moveImage = (fromIndex, toIndex) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    setImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      setErrorMessage("Please upload at least 1 image.");
      return;
    }

    // Create a FormData object to hold the form values and files
    const formData = new FormData();
    formData.append("duration", duration);
    formData.append("music", music);
    formData.append("effect", effect);

    // Append each file to the FormData object
    images.forEach((image, index) => {
      formData.append("images", image.file); // assuming image.file is the file object
    });

    const endpoint = `http://localhost:8080/videoslideshow`;

    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set correct header
        },
        responseType: "blob", // Expect binary data (Blob) from the server
      });

      // Create a video URL from the response blob
      const videoBlob = new Blob([response.data], { type: "video/mp4" });
      const videoUrl = URL.createObjectURL(videoBlob);

      // Set the video URL to display the video
      setVideoUrl(videoUrl);
      setErrorMessage(""); // Clear error message
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setErrorMessage("There was an error submitting the form.");
    }
  };

  return (
    <div className="container vh-100 d-flex  flex-column justify-content-center align-items-center gap-5">
      <DndProvider backend={HTML5Backend}>
        <Form onSubmit={handleSubmit} className="vw-100 d-flex flex-column justify-content-center align-items-center gap-4">
          {/* Image Upload Section */}
          <Form.Group controlId="formFile" className="d-flex flex-column justify-content-center align-items-center gap-4">
            <Form.Label className="fs-3 fw-bold">Upload Images (Max 6)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="bg-transparent text-white"
              size="lg"
            />
          </Form.Group>

          {/* Display Error Message */}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          {/* Drag and Drop Image Thumbnails */}
          <div className="image-preview" style={{ display: "flex" }}>
            {images.map((image, index) => (
              <DraggableImage
                key={image.id}
                index={index}
                image={image}
                moveImage={moveImage}
                handleRemove={handleRemove}
              />
            ))}
          </div>

          <Button variant="primary"  className="btn btn-primary rounded-pill btn-lg" type="submit">
            Submit
          </Button>
        </Form>

        {/* Video Display Section */}
        {videoUrl && (
          <div>
            <h3>Your Generated Video:</h3>
            <video width="600" controls>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </DndProvider>
    </div>
  );
};

export default VideoSlideshow;
