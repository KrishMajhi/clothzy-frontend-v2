import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ShopCategory from "./pages/ShopCategory";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import LoginSignup from "./pages/LoginSignup";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import mens_banner from "./assets/banner_mens.png";
import kids_banner from "./assets/banner_kids.png";
import womens_banner from "./assets/banner_women.png";
import Hero from "./components/Hero/Hero";
import Errorcomp from "./components/Errorcomp/comp";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} errorElement={<Errorcomp/>} />
          <Route path="/error"  element={<Errorcomp/>}/>
          <Route
            path="/men"
            element={<ShopCategory banner={mens_banner} category={"men"} />}
          />
          <Route
            path="/women"
            element={<ShopCategory banner={womens_banner} category={"women"} />}
          />
          <Route
            path="/kids"
            element={<ShopCategory banner={kids_banner} category={"kid"} />}
          />
          <Route path="/products" element={<Product />}>
            <Route path=":productid" />   
          </Route>
          {/* <Route path="/products/:productid" element={<Product />} /> */}
          <Route path="/cart" element={<Cart />} />

          <Route path="/login" element={<LoginSignup />} />
        </Routes>
        {/* <Footer/> */}
      </BrowserRouter>
    </>
  );
}

export default App;
