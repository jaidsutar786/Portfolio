import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Admin from "./pages/Admin";
import ResetPassword from "./pages/ResetPassword";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/x9k2m" element={<Admin />} />
        <Route path="/x9k2m/reset" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
