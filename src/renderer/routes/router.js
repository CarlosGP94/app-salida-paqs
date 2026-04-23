/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from "react";
import { Outlet, createBrowserRouter } from "react-router-dom";
import Splash from "../components/loader/Splash";
import PageLoader from "../components/loader/PageLoader";
import { Box } from "@mui/material";
import MainLayout from "../layouts/MainLayout";

import React from "react";

const App = lazy(() => import("../../App"));
// const Dashboard = lazy(() => import("pages/dashboard/Dashbaord"));

const router = createBrowserRouter(
  [
    {
      element: (
        <Suspense fallback={<Splash />}>
          <App />
        </Suspense>
      ),
      children: [
        {
          path: "/",
          element: (
            <MainLayout>
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </MainLayout>
          ),
          children: [
            {
              index: true,
              element: <Box>dasdasd</Box>,
            },
          ],
        },
      ],
    },
  ],
  {
    basename: "/venus",
  }
);

export default router;
