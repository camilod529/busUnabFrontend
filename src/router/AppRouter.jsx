import React from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { NoServicePage } from "../pages/NoServicePage";

export const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/*" element={<HomePage />} />
      </Routes>
    </>
  );
};
