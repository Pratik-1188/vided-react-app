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

  function resizeImage(file) {
    return new Promise((resolve, reject) => {
      const finalWidth = 720;
      const finalHeight = 1280;

      const img = new window.Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const aspectRatio = img.width / img.height;
        let newWidth, newHeight;

        // Calculate new dimensions
        if (img.width > img.height) {
          newWidth = finalWidth;
          newHeight = newWidth / aspectRatio;

          if (newHeight > finalHeight) {
            newHeight = finalHeight;
            newWidth = newHeight * aspectRatio;
          }
        } else {
          newHeight = finalHeight;
          newWidth = newHeight * aspectRatio;

          if (newWidth > finalWidth) {
            newWidth = finalWidth;
            newHeight = newWidth / aspectRatio;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = finalWidth;
        canvas.height = finalHeight;

        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Fill the canvas with a white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, finalWidth, finalHeight);

        // Center the image on the canvas
        const x = (finalWidth - newWidth) / 2;
        const y = (finalHeight - newHeight) / 2;
        ctx.drawImage(img, x, y, newWidth, newHeight);

        // Convert canvas to Blob and resolve the Promise
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Resizing failed"));
          }
        }, file.type);
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      setErrorMessage("Please upload at least 1 image.");
      return;
    }

    const formData = new FormData();
    formData.append("duration", duration);
    formData.append("music", music);
    formData.append("effect", effect);

    for (const image of images) {
      const resizedImage = await resizeImage(image.file); // Await the Promise
      formData.append("images", resizedImage); // Append the resized Blob
    }

    const endpoint = `${getdomain()}/videoslideshow`;

    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });

      // Clear the previous video URL to free memory
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }

      const videoBlob = new Blob([response.data], { type: "video/webm" });
      const newVideoUrl = URL.createObjectURL(videoBlob);

      setVideoUrl(newVideoUrl);
      setErrorMessage("");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setErrorMessage(
        "There was an error submitting the form. Please try again."
      );
    }
  };

  return (
    <div className="container vh-100 d-flex  flex-column justify-content-center align-items-center gap-5">
      <DndProvider backend={HTML5Backend}>
        <Form
          onSubmit={handleSubmit}
          className="vw-100 d-flex flex-column justify-content-center align-items-center gap-4"
        >
          {/* Image Upload Section */}
          <Form.Group
            controlId="formFile"
            className="d-flex flex-column justify-content-center align-items-center gap-4"
          >
            <Form.Label className="fs-3 fw-bold">
              Upload Images (Max 6)
            </Form.Label>
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

          <Button
            variant="primary"
            className="btn btn-primary rounded-pill btn-lg"
            type="submit"
          >
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
