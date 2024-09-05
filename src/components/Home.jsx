import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/frame-fusion">Frame Fusion</Link>
          </li>
        </ul>
      </nav>
      <h1>Welcome to the Home Page</h1>
    </div>
  );
};
