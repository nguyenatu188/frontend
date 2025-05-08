import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Shop } from "./screens/Shop/Shop";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Shop />
  </StrictMode>,
);
