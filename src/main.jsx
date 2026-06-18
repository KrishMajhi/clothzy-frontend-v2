import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ShopContextProvider from "./context/ShopContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import CartContextProvider from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishListContext.jsx";
import OrderContextProvider from "./context/OrderContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartContextProvider>
        <OrderContextProvider>
          <WishlistProvider>
            <ShopContextProvider>
              <App />
            </ShopContextProvider>
          </WishlistProvider>
        </OrderContextProvider>
      </CartContextProvider>
    </AuthProvider>
  </StrictMode>,
);
