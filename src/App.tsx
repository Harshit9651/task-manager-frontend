import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DailyTasks from './pages/DailyTasks';
import AddLeads from './pages/AddLeads';
import TotalLeads from './pages/TotalLeads';
import Emails from './pages/Emails';
import BulkEmail from './pages/BulkEmail';
import Settings from './pages/Settings';
import Whiteboards from './pages/Whiteboards';
import WhiteboardEditor from './pages/WhiteboardEditor';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route path="/login" element={<Login />} />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="tasks" element={<DailyTasks />} />
            <Route path="leads/add" element={<AddLeads />} />
             <Route path="leads/edit/:id" element={<AddLeads />} />
            <Route path="leads" element={<TotalLeads />} />
            <Route path="emails" element={<Emails />} />
            <Route path="whiteboards" element={<Whiteboards />} />
<Route path="whiteboards/:id" element={<WhiteboardEditor />} />
            <Route path="bulk-email" element={<BulkEmail />} />
            <Route path="settings" element={<Settings />} />

          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
