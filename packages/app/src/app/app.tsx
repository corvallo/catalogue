import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CatalogPage } from "@catalogue/pages/catalog";
import { NotFoundPage } from "@catalogue/pages/not-found";
import "./plugins/init-plugins";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/story/:id" element={<CatalogPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
