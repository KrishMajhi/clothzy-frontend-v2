import React, { useState, useEffect } from "react";
import "./Offer.css";
import imgOffer1 from "../../assets/men.png";
import imgOffer2 from "../../assets/girl.png";
import imgOffer3 from "../../assets/men2.png";
// import imgOffer4 from "../../assets/men4.png";

const offerSlides = [
  {
    heading: "Exclusive Offers For You",
    description: "Only on Best Sellers products",
    img: `${imgOffer1}`,
    background: "linear-gradient(to right, #ff9a9e, #fad0c4)",
  },
  {
    heading: "Summer Sale is Live!",
    description: "Up to 50% off on selected items",
    img: `${imgOffer2}`,
    background: "linear-gradient(to right, #a1c4fd, #c2e9fb)",
  },
  {
    heading: "Limited Time Deal",
    description: "Grab your favorites before they're gone",
    img: `${imgOffer3}`,
    background: "linear-gradient(to right, #d4fc79, #96e6a1)",
  },
];

function Offer() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % offerSlides.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // useEffect(() => {
  // }, [])
  return (
    <div className="offer-container">
      <div className="main-section">
        {offerSlides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? "active" : ""}`}
            style={{ background: slide.background }}
          >
            <div className="left-section">
              <h2 className="offer-head">{slide.heading}</h2>
              {currentSlide == 2 ? (
                <p className="describesection   desc">{slide.description}</p>
              ) : (
                <p className="describesection">{slide.description}</p>
              )}

              <div className="btnChecknow">Check now</div>
            </div>
            <img
              src={slide.img}
              alt="Offer"
              className={`imgoffer imgoffer${index + 1}`} // Dynamically apply the class
            />
          </div>
        ))}
      </div>

      {/* Pause/Play Button */}
      <button className="toggle-btn" onClick={togglePause}>
        {isPaused ? "Resume" : "Pause"} Slider
      </button>
    </div>
  );
}

export default Offer;
