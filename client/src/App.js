import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { AppThemeContextProvider } from "./context/AppThemeContext";
import { UserContextProvider } from "./context/UserContext";
import { FeatureFlagsContextProvider } from "./context/FeatureFlagsContext";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import AdminPage from "./pages/AdminPage";
import ErrorPage from "./pages/ErrorPage";
import QuizPage from "./pages/QuizPage";
import MapPage from "./pages/MapPage/MapPage";
import AppLayout from "./pages/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { getAllUsers } from "./services/usersService";
import ProtectedRouteByFlag from "./components/ProtectedRouteByFlag";

function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <Router>
        <UserContextProvider>
          <FeatureFlagsContextProvider>
            <AppThemeContextProvider>
              <AppRoutes />
            </AppThemeContextProvider>
          </FeatureFlagsContextProvider>
        </UserContextProvider>
      </Router>
    </ErrorBoundary>
  );
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="users" element={<UsersPage getUsersOp={getAllUsers} />} />
        <Route path="home" element={<MainPage />} />
        <Route
          path="quiz"
          element={
            <ProtectedRouteByFlag flagKey="page.emergency-training">
              <QuizPage />
            </ProtectedRouteByFlag>
          }
        />
        <Route
          path="map"
          element={
            <ProtectedRouteByFlag flagKey="page.airport-challenge">
              <MapPage />
            </ProtectedRouteByFlag>
          }
        />
        <Route path="admin" element={<AdminPage />} />
        <Route index element={<Navigate to="/home" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default App;
