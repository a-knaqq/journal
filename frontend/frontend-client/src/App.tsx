// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import HomePage from "./pages/homePage";
import ConfirmUserPage from "./pages/confirmUserPage";
import ImageGalleryPage from "./pages/imageGalleryPage";
import StravaPage from "./pages/StravaPage.jsx";
import RideTracking from "./pages/RideTrackingPage";
import NotificationsPage from "./pages/NotificationsPage";
import Layout from "./components/Layout.jsx";
import "./output.css";
import "./App.css";

const App = () => {
  const isAuthenticated = () => {
    const accessToken = sessionStorage.getItem("accessToken");
    return !!accessToken;
  };

  // Define the onCardSelect function
  const handleCardSelect = () => {
    // Any logic you need when a card is selected, e.g., closing overlays, logging, etc.
    console.log("Card was selected!");
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/confirm" element={<ConfirmUserPage />} />

        {/* Authenticated Routes */}
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate replace to="/home" />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/home"
          element={
            isAuthenticated() ? (
              <Layout>
                {/* Pass handleCardSelect as a prop to HomePage */}
                <HomePage onCardSelect={handleCardSelect} />
              </Layout>
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/gallery"
          element={
            isAuthenticated() ? (
              <Layout>
                <ImageGalleryPage />
              </Layout>
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/strava"
          element={
            isAuthenticated() ? (
              <Layout>
                <StravaPage />
              </Layout>
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/track-rides"
          element={
            isAuthenticated() ? (
              <Layout>
                <RideTracking />
              </Layout>
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated() ? (
              <Layout>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
