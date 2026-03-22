import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ShopCategory from "./pages/ShopCategory";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import LoginSignup from "./pages/LoginSignup";
import Navbar from "./components/Navbar/Navbar";
import Errorcomp from "./components/Errorcomp/comp";

// ✅ Unsplash direct URLs — no imports needed
const mens_banner = "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=1100&h=300&fit=crop";
const womens_banner = "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1100&h=300&fit=crop";
const kids_banner = "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=1100&h=300&fit=crop";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} errorElement={<Errorcomp />} />
          <Route path="/error" element={<Errorcomp />} />
          <Route path="/men"   element={<ShopCategory banner={mens_banner}   category={"men"} />} />
          <Route path="/women" element={<ShopCategory banner={womens_banner} category={"women"} />} />
          <Route path="/kids"  element={<ShopCategory banner={kids_banner}   category={"kid"} />} />
          <Route path="/products" element={<Product />}>
            <Route path=":productid" />
          </Route>
          <Route path="/cart"  element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;