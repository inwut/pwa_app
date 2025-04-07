import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";

import { useAuth } from "../providers/AuthProvider.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import HomePage from "../pages/HomePage.jsx";
import RecipesPage from "../../recipes/pages/RecipesPage.jsx";
import CreateRecipePage from "../../recipes/pages/CreateRecipePage.jsx";
import RecipePage from "../../recipes/pages/RecipePage.jsx";
import FavoritesPage from "../../recipes/pages/FavoritesPage.jsx";
import AuthPage from "../../users/pages/AuthPage.jsx";
import ProfilePage from "../../users/pages/ProfilePage.jsx";
import UsersPage from "../../users/pages/UsersPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import NavBar from "../components/navigation/NavBar.jsx";
import Loader from "../components/Loader.jsx";

const AppLayout = () => (
  <>
    <NavBar />
    <main className="main">
      <Outlet />
    </main>
  </>
);

const AppRoutes = () => {
  const { currentUser, isLoading } = useAuth();

  return isLoading ? (
    <Loader />
  ) : (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="recipes" element={<RecipesPage />} />
        <Route
          path="recipes/create"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <CreateRecipePage />
            </ProtectedRoute>
          }
        />
        <Route path="recipes/:recipeId" element={<RecipePage />} />
        <Route
          path="recipes/edit/:recipeId"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <CreateRecipePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="favorites"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        {!currentUser && <Route path="auth" element={<AuthPage />} />}
        <Route path="profile/:userId" element={<ProfilePage />} />
        <Route path="users" element={<UsersPage type="users" />} />
        <Route
          path="profile/:userId/following"
          element={<UsersPage type="following" />}
        />
        <Route
          path="profile/:userId/followers"
          element={<UsersPage type="followers" />}
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
