// ── Add this import at the top of your router file (App.jsx or routes.jsx) ──

import OrderConfirmationPage from "./pages/checkout/OrderConfirmationPage";

// ── Add this route alongside your existing /checkout route ──
// (inside your <Routes> or router config)

<Route path="/order-confirmation" element={<OrderConfirmationPage />} />

// ── If you're using createBrowserRouter, add this object to your routes array ──

{
  path: "/order-confirmation",
  element: <OrderConfirmationPage />,
}
