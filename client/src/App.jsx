import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DoctorLayout from './layouts/DoctorLayout';
import PatientLayout from './layouts/PatientLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Patient Pages
import BookAppointment from './pages/patient/BookAppointment';
import UpcomingAppointments from './pages/patient/UpcomingAppointments';
import AppointmentHistory from './pages/patient/AppointmentHistory';
import PatientProfile from './pages/patient/PatientProfile';

// Doctor Pages
import Dashboard from './pages/doctor/Dashboard';
import CalendarView from './pages/doctor/Calendar';
import DoctorAppointments from './pages/doctor/Appointments';
import AvailabilityPage from './pages/doctor/Availability';
import DoctorProfile from './pages/doctor/DoctorProfile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Route>

            {/* Patient Routes */}
            <Route
              path="/patient"
              element={
                <ProtectedRoute role="patient">
                  <PatientLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="book" replace />} />
              <Route path="book" element={<BookAppointment />} />
              <Route path="upcoming" element={<UpcomingAppointments />} />
              <Route path="history" element={<AppointmentHistory />} />
              <Route path="profile" element={<PatientProfile />} />
              <Route path="settings" element={<PatientProfile />} />
            </Route>

            {/* Doctor Routes */}
            <Route
              path="/doctor"
              element={
                <ProtectedRoute role="doctor">
                  <DoctorLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="calendar" element={<CalendarView />} />
              <Route path="appointments" element={<DoctorAppointments />} />
              <Route path="availability" element={<AvailabilityPage />} />
              <Route path="profile" element={<DoctorProfile />} />
              <Route path="settings" element={<AvailabilityPage />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '12px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
