import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./components/Home";
import VideoSlideshow from "./components/VideoSlideshow";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/videoslideshow" element={<VideoSlideshow />} />
      </Routes>
    </>
  );
};

export default App;
