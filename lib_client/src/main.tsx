import React from "react";
import ReactDOM from "react-dom/client";
import { ShellRoot } from "./components/shell/ShellRoot.js"
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ShellRoot />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// 1. students list, create, update, delete, route
// 2. books    " "    "  "    "  "    "   "   "  "
// 3. notices
// 4. text search, mandatory
// 5. pagination, mandatory
// 6. authentication