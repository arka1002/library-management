import React from "react";
import ReactDOM from "react-dom/client";
import { ShellRoot } from "./components/shell/ShellRoot.js";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Student } from "./components/student/Student.js";
import { Intro } from "./components/intro/Intro.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ShellRoot />,
    children: [
      {
        path: "/details/students",
        element: <Student />,
      },
      {
        path: "/details/students/:student_roll",
        element: <Intro />
      }
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);

// 1. students list, create, update, delete, route
// 2. books    " "    "  "    "  "    "   "   "  "
// 3. notices
// 4. text search, mandatory
// 5. pagination, mandatory
// 6. authentication
