import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MapComponent from "./components/Map/MapComponent";
import Login from "./components/Auth/Login";
import { theme } from "./theme"; 

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Router>
      <div style={{ backgroundColor: theme.colors.background, minHeight: "100vh" }}>
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                
                <div style={{ padding: theme.spacing.medium }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      marginBottom: theme.spacing.medium,
                      backgroundColor: theme.colors.accent,
                      color: theme.colors.secondary,
                      padding: theme.spacing.small,
                      borderRadius: "4px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Logout
                  </button>
                  <h1 style={{ color: theme.colors.primary, textAlign: "center" }}>Mapa Interativo</h1>
                  
                  <MapComponent />
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;