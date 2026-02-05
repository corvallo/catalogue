import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CatalogPage } from "@catalogue/pages/catalog/ui/catalog-page";
import { NotFoundPage } from "@catalogue/pages/not-found/ui/not-found-page";
import "./init-plugins";

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
