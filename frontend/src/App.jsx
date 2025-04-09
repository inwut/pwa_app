import React from "react";
import { BrowserRouter } from "react-router-dom";

import "./App.css";
import AppRoutes from "./common/routes/AppRoutes.jsx";
import { AuthProvider } from "./common/providers/AuthProvider.jsx";
import { NotificationProvider } from "./common/providers/NotificationProvider.jsx";

const App = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </NotificationProvider>
  );
};

export default App;
