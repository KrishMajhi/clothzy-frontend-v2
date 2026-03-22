import React from "react";
import "./Hero.css";
// import heroImg from "../assets/product_32.png";
import heroImg from "../../assets/hero_image.png";
// import heroImg from "../../";

function Hero() {
  console.log("Hero is rendering");

  return (
    <div className="main-container-hero">
      <div className="hero-left">
        <div className="text-container">
          {/* <h2 className="hero-h">NEW ARRIVALS ONLY!</h2> */}
          <h2 className="hero-heading">Style That Speaks For You</h2>

          {/* <p className="p-hero">
            <span style={{ fontWeight: 300, color: "black" }}>New👋</span>{" "}
            Collections for everyone
          </p> */}
          <p className="p-hero">
            <span style={{ fontWeight: 300, color: "black" }}>Fresh</span>{" "}
            styles
            <br />
            for bold confidence — made for you
          </p>
        </div>
        <div className="btn">Shop New Arrivals →</div>
      </div>

      <div className="hero-right">
        <img src={heroImg} className="shadow-img" alt="" />
      </div>
      <div className="floor-fade"></div>

      <div className="floor"></div>
    </div>
  );
}

export default Hero;
