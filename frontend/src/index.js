import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";
// Import the new OrderContext provider
import { OrderProvider } from "./context/OrderContext";
import "react-toastify/dist/ReactToastify.css";

const container = document.getElementById("app");
const root = createRoot(container);

// root.render(
//   <BrowserRouter>
//     <MaterialUIControllerProvider>
//       <App />
//     </MaterialUIControllerProvider>
//   </BrowserRouter>
// );

root.render(
  <BrowserRouter>
    <MaterialUIControllerProvider>
      {/* Wrap the app with OrderProvider */}
      <OrderProvider>
        <App />
      </OrderProvider>
    </MaterialUIControllerProvider>
  </BrowserRouter>
);
