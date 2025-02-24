import React from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import "./App.css";
import HomePage from "./home/pages/HomePage.jsx";
import RecipesPage from "./recipes/pages/RecipesPage.jsx";
import RecipePage from "./recipes/pages/RecipePage.jsx";
import NotFoundPage from "./common/pages/NotFoundPage.jsx";
import CreateRecipePage from "./recipes/pages/CreateRecipePage.jsx";
import FavoritesPage from "./recipes/pages/FavoritesPage.jsx";
import EditRecipePage from "./recipes/pages/EditRecipePage.jsx";
import AuthPage from "./users/pages/AuthPage.jsx";
import ProfilePage from "./users/pages/ProfilePage.jsx";
import UsersPage from "./users/pages/UsersPage.jsx";
import NavBar from "./common/components/navigation/Navbar.jsx";

const AppLayout = () => (
  <>
    <NavBar />
    <main className="main">
      <Outlet />
    </main>
  </>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="recipes" element={<RecipesPage />} />
          <Route path="recipes/create" element={<CreateRecipePage />} />
          <Route path="recipes/:recipeId" element={<RecipePage />} />
          <Route path="recipes/edit/:recipeId" element={<EditRecipePage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="profile/:userId" element={<ProfilePage />} />
          <Route path="users" element={<UsersPage />} />
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
    </BrowserRouter>
  );
}

export default App;
