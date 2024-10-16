import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigator = useNavigate()
  return (
    <div className="container vh-100 d-flex  flex-column justify-content-center align-items-center gap-5">
      <h1 className="fs-1 fw-bold">Welcome to the Slide Show AI</h1>
      <button type="button" className="btn btn-primary rounded-pill btn-lg" onClick={() => {navigator("/videoslideshow")}}>Video Slideshow</button>
    </div>
  );
};
