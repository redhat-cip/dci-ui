import { Routes, Route, Navigate } from "react-router-dom";
import "App.css";
import "ui/styles";
import "css/alignment.css";
import "css/spacing.css";
import "css/flex.css";
import JobsPage from "jobs/JobsPage";
import JobPage from "jobs/job/JobPage";
import JobStatesPage from "jobs/job/jobStates/JobStatesPage";
import JobTestsPage from "jobs/job/tests/JobTestsPage";
import JobFilesPage from "jobs/job/files/JobFilesPage";
import JobSettingsPage from "jobs/job/settings/JobSettingsPage";
import FilePage from "jobs/job/files/FilePage";
import ProductsPage from "products/ProductsPage";
import TopicsPage from "topics/TopicsPage";
import TopicPage from "topics/TopicPage";
import ComponentPage from "component/ComponentPage";
import RemotecisPage from "remotecis/RemotecisPage";
import FeedersPage from "feeders/FeedersPage";
import TeamsPage from "teams/TeamsPage";
import TeamPage from "teams/TeamPage";
import UsersPage from "users/UsersPage";
import EditUserPage from "users/edit/EditUserPage";
import CreateFeederPage from "feeders/create/CreateFeederPage";
import EditFeederPage from "feeders/edit/EditFeederPage";
import SettingsPage from "settings/SettingsPage";
import NotificationsPage from "notifications/NotificationsPage";
import PermissionsPage from "permissions/PermissionsPage";
import ProductsPermissionsPage from "permissions/ProductsPermissionsPage";
import TopicsPermissionsPage from "permissions/TopicsPermissionsPage";
import LoginPage from "auth/LoginPage";
import LoginCallbackPage from "auth/LoginCallbackPage";
import SilentRedirectPage from "auth/SilentRedirectPage";
import Page404 from "pages/Page404";
import TasksDurationPerJobPage from "analytics/TasksDurationPerJob/TasksDurationPerJobPage";
import AnalyticsPage from "analytics/AnalyticsPage";
import LatestJobStatusPage from "analytics/LatestJobStatus/LatestJobStatusPage";
import LatestJobStatusDetailsPage from "analytics/LatestJobStatus/LatestJobStatusDetailsPage";
import ComponentCoveragePage from "analytics/ComponentCoverage/ComponentCoveragePage";
import JunitComparisonPage from "analytics/JunitComparison/JunitComparisonPage";
import NotAuthenticatedLayout from "pages/NotAuthenticatedLayout";
import { BackgroundImage } from "ui";
import Alerts from "alerts/Alerts";
import AuthenticatedLayout from "pages/AuthenticatedLayout";
import JobTestPage from "jobs/job/tests/test/JobTestPage";
import PipelinesPage from "analytics/Pipelines/PipelinesPage";

export default function App() {
  return (
    <>
      <BackgroundImage />
      <Alerts />
      <Routes>
        <Route path="/">
          <Route index element={<Navigate replace to="jobs" />} />
          <Route element={<NotAuthenticatedLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="login_callback" element={<LoginCallbackPage />} />
            <Route path="silent_redirect" element={<SilentRedirectPage />} />
          </Route>
          <Route element={<AuthenticatedLayout />}>
            <Route path="analytics">
              <Route index element={<AnalyticsPage />} />
              <Route
                path="junit_comparison"
                element={<JunitComparisonPage />}
              />
              <Route
                path="component_coverage"
                element={<ComponentCoveragePage />}
              />
              <Route
                path="tasks_duration_per_job"
                element={<TasksDurationPerJobPage />}
              />
              <Route
                path="latest_jobs_status"
                element={<LatestJobStatusPage />}
              />
              <Route
                path="latest_jobs_status/:topic_name"
                element={<LatestJobStatusDetailsPage />}
              />
              <Route path="pipelines" element={<PipelinesPage />} />
            </Route>
            <Route path="jobs">
              <Route index element={<JobsPage />} />
              <Route path=":job_id" element={<JobPage />}>
                <Route index element={<JobStatesPage />} />
                <Route path="jobStates" element={<JobStatesPage />} />
                <Route path="tests/:file_id" element={<JobTestPage />} />
                <Route path="tests" element={<JobTestsPage />} />
                <Route path="files" element={<JobFilesPage />} />
                <Route path="settings" element={<JobSettingsPage />} />
              </Route>
            </Route>
            <Route path="files/:file_id" element={<FilePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="topics">
              <Route index element={<TopicsPage />} />
              <Route path=":topic_id/components/" element={<TopicPage />} />
              <Route
                path=":topic_id/components/:component_id"
                element={<ComponentPage />}
              />
            </Route>
            <Route path="remotecis" element={<RemotecisPage />} />
            <Route path="feeders">
              <Route index element={<FeedersPage />} />
              <Route path="create" element={<CreateFeederPage />} />
              <Route path=":feeder_id" element={<EditFeederPage />} />
            </Route>
            <Route path="teams">
              <Route index element={<TeamsPage />} />
              <Route path=":team_id" element={<TeamPage />} />
            </Route>
            <Route path="users">
              <Route index element={<UsersPage />} />
              <Route path=":user_id" element={<EditUserPage />} />
            </Route>
            <Route path="currentUser">
              <Route path="settings" element={<SettingsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
            </Route>
            <Route path="permissions" element={<PermissionsPage />}>
              <Route path="products" element={<ProductsPermissionsPage />} />
              <Route path="topics" element={<TopicsPermissionsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </>
  );
}
