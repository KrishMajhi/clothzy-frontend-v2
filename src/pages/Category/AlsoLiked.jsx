import React from "react";
import { ALSO_LIKED, useReveal } from "./shopCategoryConstants";

function AlsoLiked() {
  const ref = useReveal();

  return (
    <div className="also-viewed reveal" ref={ref}>
      <div className="av-header">
        <h3 className="av-title">You may also <em>like</em></h3>
        <a href="#" className="av-link">View all →</a>
      </div>
      <div className="av-scroll">
        {ALSO_LIKED.map(item => (
          <div className="av-card" key={item.name}>
            <div className="av-card-img">
              <img src={item.img} alt={item.name} loading="lazy" />
            </div>
            <p className="av-card-name">{item.name}</p>
            <p className="av-card-price">{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlsoLiked;
