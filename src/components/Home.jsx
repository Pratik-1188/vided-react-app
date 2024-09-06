import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/videoslideshow">Video Slideshow</Link>
          </li>
        </ul>
      </nav>
      <h1>Welcome to the Home Page</h1>
    </div>
  );
};
