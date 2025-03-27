import React from "react";
import { BrowserRouter } from "react-router-dom";

import "./App.css";
import AppRoutes from "./common/routes/AppRoutes.jsx";
import { AuthProvider } from "./common/providers/AuthProvider.jsx";
import { ErrorProvider } from "./common/providers/ErrorProvider.jsx";

const App = () => {
  return (
    <ErrorProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ErrorProvider>
  );
};

export default App;
