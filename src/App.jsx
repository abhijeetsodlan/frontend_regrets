import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import QuestionsPage from "./pages/index";
import RegretDetailPage from "./pages/regretDetailPage";
import GetStarted from "./pages/getStarted";
import MyProfile from "./pages/myProfile";
import PrivacyPolicy from "./pages/privacyPolicy";
import Navbar from "../components/navbar";
import AuthSuccess from "../components/AuthSuccess";
import Login from "../components/LoginPage";
import Footer from "../components/Footer";

// Layout component for pages with Navbar and Footer
const DefaultLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

// Protected Route: Only accessible if logged in
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("auth_token");
  const location = useLocation();

  if (!isAuthenticated && location.pathname !== "/") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route: Only accessible if not logged in
const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("auth_token");

  if (isAuthenticated) {
    return <Navigate to="/regrets" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <Routes>
          {/* Public Routes (accessible to everyone) */}
          <Route
            path="/"
            element={
              <>
                <GetStarted />
                <Footer />
              </>
            }
          />

          {/* Privacy Policy Route (accessible to everyone) */}
          <Route
            path="/privacy-policy"
            element={
              <DefaultLayout>
                <PrivacyPolicy />
              </DefaultLayout>
            }
          />

          {/* Auth Success Route (no Navbar/Footer, accessible to all) */}
          <Route path="/questions/auth-success" element={<AuthSuccess />} />

          {/* Login Route (only for unauthenticated users) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Protected Routes (require authentication) */}
          <Route
            path="/regrets"
            element={
              <DefaultLayout>
                <QuestionsPage />
              </DefaultLayout>
            }
          />
          <Route
            path="/regrets/:regret_id"
            element={
              <ProtectedRoute>
                <DefaultLayout>
                  <RegretDetailPage />
                </DefaultLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/myprofile"
            element={
              <ProtectedRoute>
                <DefaultLayout>
                  <MyProfile />
                </DefaultLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
