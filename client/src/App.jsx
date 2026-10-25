import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ModalProvider } from './context/ModalContext';
import AppLayout from './components/layout/AppLayout';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import GroupsPage from './pages/GroupsPage';
import GroupDetailPage from './pages/GroupDetailPage';
import PersonalExpensesPage from './pages/PersonalExpensesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettlementsPage from './pages/SettlementsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const { user, checking } = useAuth();

  if (checking) {
    return (
      <div className="boot">
        SplitSmart<span>.</span>
      </div>
    );
  }
  if (!user) return <AuthPage />;

  return (
    <DataProvider>
      <ModalProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/groups/:groupId" element={<GroupDetailPage />} />
            <Route path="/expenses" element={<PersonalExpensesPage />} />
            <Route path="/insights" element={<AnalyticsPage />} />
            <Route path="/settlements" element={<SettlementsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ModalProvider>
    </DataProvider>
  );
}
