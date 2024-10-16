import { Route, Routes } from "react-router-dom";
import { Home } from "./components/Home";
import VideoSlideshow from "./components/VideoSlideshow";
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";


const App = () => {
  return (
    <div className="page-background">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/videoslideshow" element={<VideoSlideshow />} />
      </Routes>
    </div>
  );
};

export default App;
