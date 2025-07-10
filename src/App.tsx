import { Routes, Route, Navigate } from "react-router";
import Alerts from "alerts/Alerts";
import JobsPage from "jobs/JobsPage";
import JobPage from "jobs/job/JobPage";
import JobStatesPage from "jobs/job/jobStates/JobStatesPage";
import JobTestsPage from "jobs/job/tests/JobTestsPage";
import JobFilesPage from "jobs/job/files/JobFilesPage";
import JobSettingsPage from "jobs/job/settings/JobSettingsPage";
import FilePage from "jobs/job/files/FilePage";
import JobTestPage from "jobs/job/tests/test/JobTestPage";
import ProductsPage from "products/ProductsPage";
import TopicsPage from "topics/TopicsPage";
import TopicPage from "topics/TopicPage";
import ComponentPage from "topics/component/ComponentPage";
import ComponentsPage from "components/ComponentsPage";
import RemotecisPage from "remotecis/RemotecisPage";
import FeedersPage from "feeders/FeedersPage";
import TeamsPage from "teams/TeamsPage";
import TeamPage from "teams/TeamPage";
import UsersPage from "users/UsersPage";
import UserPage from "users/UserPage";
import NotificationsPage from "notifications/NotificationsPage";
import LoginPage from "auth/LoginPage";
import LoginCallbackPage from "auth/LoginCallbackPage";
import SilentRedirectPage from "auth/SilentRedirectPage";
import AdminLoginPage from "auth/AdminLoginPage";
import Page404 from "pages/Page404";
import RedirectPage from "pages/RedirectPage";
import AuthenticatedLayout from "pages/AuthenticatedLayout";
import TasksDurationPerJobPage from "analytics/TasksDurationPerJob/TasksDurationPerJobPage";
import AnalyticsPage from "analytics/AnalyticsPage";
import JobStatsPage from "analytics/jobsStats/JobStatsPage";
import ComponentCoveragePage from "analytics/ComponentCoverage/ComponentCoveragePage";
import JunitComparisonPage from "analytics/JunitComparison/JunitComparisonPage";
import PipelinesPage from "analytics/Pipelines/PipelinesPage";
import KeyValuesPage from "analytics/KeyValues/KeyValuesPage";
import TestsAnalysisPage from "analytics/TestsAnalysis/TestsAnalysisPage";

export default function App() {
  return (
    <>
      <Alerts />
      <Routes>
        <Route path="/">
          <Route index element={<Navigate replace to="jobs" />} />
          <Route>
            <Route path="login" element={<LoginPage />} />
            <Route path="login_callback" element={<LoginCallbackPage />} />
            <Route path="silent_redirect" element={<SilentRedirectPage />} />
            <Route path="dci-admin" element={<AdminLoginPage />} />
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
              <Route path="job_stats" element={<JobStatsPage />} />
              <Route path="pipelines" element={<PipelinesPage />} />
              <Route path="keyvalues" element={<KeyValuesPage />} />
              <Route
                path="testing_trend"
                element={<RedirectPage to="/analytics/tests" replace />}
              />
              <Route path="tests" element={<TestsAnalysisPage />} />
            </Route>
            <Route path="jobs">
              <Route index element={<JobsPage />} />
              <Route path=":job_id" element={<JobPage />}>
                <Route index element={<JobStatesPage />} />
                <Route path="jobStates" element={<JobStatesPage />} />
                <Route path="tests">
                  <Route index element={<JobTestsPage />} />
                  <Route path=":file_id" element={<JobTestPage />} />
                </Route>
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
            <Route path="components">
              <Route index element={<ComponentsPage />} />
              <Route path=":component_id" element={<ComponentPage />} />
            </Route>
            <Route path="remotecis" element={<RemotecisPage />} />
            <Route path="feeders" element={<FeedersPage />} />
            <Route path="teams">
              <Route index element={<TeamsPage />} />
              <Route path=":team_id" element={<TeamPage />} />
            </Route>
            <Route path="users">
              <Route index element={<UsersPage />} />
              <Route path=":user_id" element={<UserPage />} />
            </Route>
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </>
  );
}
