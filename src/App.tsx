import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./ui/styles";
import "./css/alignment.css";
import "./css/spacing.css";
import "./css/flex.css";
import Pages from "./pages";
import PrivateRoute from "auth/PrivateRoute";

export default function App() {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Pages.DashboardPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/:topic_name"
        element={
          <PrivateRoute>
            <Pages.DashboardDetailsPage />
          </PrivateRoute>
        }
      />

      <Route path="/" element={<Navigate replace to="/jobs" />} />
      <Route
        path="/jobs"
        element={
          <PrivateRoute>
            <Pages.JobsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/jobs/:id"
        element={<Navigate replace to="/jobs/:id/jobStates" />}
      />
      <Route
        path="/jobs/:id/:endpoint"
        element={
          <PrivateRoute>
            <Pages.JobPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/files/:id"
        element={
          <PrivateRoute>
            <Pages.FilePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/products"
        element={
          <PrivateRoute>
            <Pages.ProductsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/topics"
        element={
          <PrivateRoute>
            <Pages.TopicsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/topics/:topic_id/components/:id"
        element={
          <PrivateRoute>
            <Pages.ComponentPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/topics/:id/components"
        element={
          <PrivateRoute>
            <Pages.TopicPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/remotecis"
        element={
          <PrivateRoute>
            <Pages.RemotecisPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/feeders/create"
        element={
          <PrivateRoute>
            <Pages.CreateFeederPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/feeders/:id"
        element={
          <PrivateRoute>
            <Pages.EditFeederPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/feeders"
        element={
          <PrivateRoute>
            <Pages.FeedersPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/teams"
        element={
          <PrivateRoute>
            <Pages.TeamsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/teams/:id"
        element={
          <PrivateRoute>
            <Pages.TeamPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/users"
        element={
          <PrivateRoute>
            <Pages.UsersPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/users/:id"
        element={
          <PrivateRoute>
            <Pages.EditUserPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/currentUser/settings"
        element={
          <PrivateRoute>
            <Pages.SettingsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/currentUser/notifications"
        element={
          <PrivateRoute>
            <Pages.NotificationsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/permissions"
        element={
          <PrivateRoute>
            <Pages.PermissionsPage />
          </PrivateRoute>
        }
      />

      <Route path="/login" element={<Pages.LoginPage />} />
      <Route path="/login_callback" element={<Pages.LoginCallbackPage />} />
      <Route path="/silent_redirect" element={<Pages.SilentRedirectPage />} />
      <Route path="*" element={<Pages.Page404 />} />
    </Routes>
  );
}
