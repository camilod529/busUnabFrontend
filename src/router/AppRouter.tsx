import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { BuenaVibraPage } from "../pages/BuenaVibraPage";
import { CreditsPage } from "../pages/CreditsPage";
export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/*" element={<HomePage />} />
      <Route path="/buenavibra" element={<BuenaVibraPage />} />
      <Route path="/credits" element={<CreditsPage />} />
    </Routes>
  );
};
