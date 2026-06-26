import React, { useState } from "react";

import Loader from "./components/Loader/Loader";
import CustomCursor from "./components/CustomCursor/CustomCursor";
import BackToTop from "./components/BackToTop/BackToTop";
import Hero from "./components/Hero/Hero";
import Marquee from "./components/Marquee/Marquee";
import UspStrip from "./components/UspStrip/UspStrip";
import CategoryTiles from "./components/CategoryTiles/CategoryTiles";
import NewArrivals from "./components/NewArrivals/NewArrivals";
import FeatureBanner from "./components/FeatureBanner/FeatureBanner";
import PopularCollections from "./components/PopularCollections/PopularCollections";
import StatsStrip from "./components/StatsStrip/StatsStrip";
import StyleJournal from "./components/StyleJournal/StyleJournal";
import Testimonials from "./components/Testimonials/Testimonials";
import Newsletter from "./components/Newsletter/Newsletter";
import Footer from "./components/Footer/Footer";
import useScrollReveal from "./components/useScrollReveal";
import useMagneticButtons from "./components/useMagneticButtons";
import "./clzv3-globals.css";

// Module-level flag: starts false on every real page load/reload
// (since the JS module itself re-evaluates from scratch), and flips
// to true the first time Home finishes its intro. Because client-side
// route changes (Home -> Men -> Home) do NOT reload the JS module,
// this correctly stays true on re-entry without using sessionStorage
// at all — which also means the intro plays again as soon as you
// actually reload the page, exactly as requested.
let hasIntroPlayedThisLoad = false;

function Home() {
  const [hasPlayedIntro] = useState(hasIntroPlayedThisLoad);
  const [isHeroReady, setIsHeroReady] = useState(hasIntroPlayedThisLoad);

  const handleLoaderDone = () => {
    hasIntroPlayedThisLoad = true;
    setIsHeroReady(true);
  };

  // Global behaviors that span across multiple sections.
  useScrollReveal();
  useMagneticButtons();

  return (
    <div className="clzv3-root">
      {!hasPlayedIntro && <Loader onDone={handleLoaderDone} />}
      <CustomCursor />
      <BackToTop />

      <Hero isReady={isHeroReady} />

      <Marquee />
      <UspStrip />

      <CategoryTiles />
      <NewArrivals />
      <FeatureBanner />
      <PopularCollections />

      <StatsStrip />
      <StyleJournal />
      <Testimonials />
      <Newsletter />

      <Footer />
    </div>
  );
}

export default Home;