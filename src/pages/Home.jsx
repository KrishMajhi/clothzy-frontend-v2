  import React from "react";

import Hero from "../components/Hero/Hero";
import Items from "../components/items/Items";
import Popular from "../components/Popular/Popular";
import Offer from "../components/Offer/Offer";
import Newcollections from "../components/newCollection/Newcollections";
import Newsletter from "../components/Newsletter/Newsletter";
import Footer from "../components/Footer/Footer";

function Home() {

  //  u

  return (
    <div>
      <Hero/>
      <Popular />
        <Offer />
        <Newcollections/>
        <Newsletter/>
        <Footer/>
    </div>
  );
}

export default Home;
