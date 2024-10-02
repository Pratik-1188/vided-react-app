import React, { useState } from "react";
import { Form, Image, Alert } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";

const ItemType = "IMAGE";

/* TODO:
  Upload tab shows count as intial even if u delete the img after upload
  limit only image upload
*/

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

    const endpoint = "http://localhost:8080/videoslideshow";

    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set correct header
        },
      });

      console.log("Server Response:", response.data);

      // Reset the form or provide success feedback
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
    <DndProvider backend={HTML5Backend}>
      <Form onSubmit={handleSubmit}>
        {/* Duration Dropdown */}
        <Form.Group controlId="formDuration">
          <Form.Label>Duration</Form.Label>
          <Form.Control
            as="select"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="3">3 seconds</option>
            <option value="5">5 seconds</option>
            <option value="7">7 seconds</option>
          </Form.Control>
        </Form.Group>

        {/* Music Dropdown */}
        <Form.Group controlId="formMusic">
          <Form.Label>Background Music</Form.Label>
          <Form.Control
            as="select"
            value={music}
            onChange={(e) => setMusic(e.target.value)}
          >
            <option value="Classical">Classical</option>
            <option value="Pop">Pop</option>
            <option value="Rock">Rock</option>
          </Form.Control>
        </Form.Group>

        {/* Effect Dropdown */}
        <Form.Group controlId="formEffect">
          <Form.Label>Effect</Form.Label>
          <Form.Control
            as="select"
            value={effect}
            onChange={(e) => setEffect(e.target.value)}
          >
            <option value="Zoom In">Zoom In</option>
            <option value="Zoom Out">Zoom Out</option>
          </Form.Control>
        </Form.Group>

        {/* Image Upload Section */}
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Upload Images (Max 6)</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
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

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </DndProvider>
  );
};

export default VideoSlideshow;
