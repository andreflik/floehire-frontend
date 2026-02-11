import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import CandidateLogin from "./pages/CandidateLogin";
import CandidateRegisterWizard from "./pages/CandidateRegisterWizard";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login/candidate" element={<CandidateLogin />} />
        {/* <Route path="/register/candidate" element={<CandidateRegister />} /> */}
        <Route path="/register/candidate" element={<CandidateRegisterWizard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
