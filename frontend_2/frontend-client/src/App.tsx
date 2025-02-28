import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import HomePage from "./pages/homePage";
import ConfirmUserPage from "./pages/confirmUserPage";
import Page1 from "./pages/page1";
import Page2 from "./pages/page2";
import Page3 from "./pages/page3";
import Page4 from "./pages/page4";
import Page5 from "./pages/page5";
import Layout from "./components/Layout.jsx";
import "./output.css";
import "./App.css";

const App = () => {
  const isAuthenticated = () => {
    const accessToken = sessionStorage.getItem("accessToken");
    return !!accessToken;
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
                <HomePage />
              </Layout>
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/page1"
          element={
            isAuthenticated() ? (
              <Layout>
                <Page1 />
              </Layout>
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/page2"
          element={
            isAuthenticated() ? (
              <Layout>
                <Page2 />
              </Layout>
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/page3"
          element={
            isAuthenticated() ? (
              <Layout>
                <Page3 />
              </Layout>
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/page4"
          element={
            isAuthenticated() ? (
              <Layout>
                <Page4 />
              </Layout>
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/page5"
          element={
            isAuthenticated() ? (
              <Layout>
                <Page5 />
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
