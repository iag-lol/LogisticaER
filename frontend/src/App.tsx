import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoadingScreen } from '@/components/common/loading-screen'
import { ProtectedRoute } from '@/app/routes/protected-route'
import { PublicRoute } from '@/app/routes/public-route'
import { MainLayout } from '@/layouts/main-layout'

const LoginPage = lazy(() => import('@/pages/auth/login-page'))
const DashboardPage = lazy(() => import('@/pages/dashboard/dashboard-page'))
const TasksPage = lazy(() => import('@/pages/tasks/tasks-page'))
const MeetingsPage = lazy(() => import('@/pages/meetings/meetings-page'))
const ReportsPage = lazy(() => import('@/pages/reports/reports-page'))
const CleaningPage = lazy(() => import('@/pages/cleaning/cleaning-page'))
const AttendancePage = lazy(() => import('@/pages/attendance/attendance-page'))
const RequestsPage = lazy(() => import('@/pages/requests/requests-page'))

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/auth/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/meetings" element={<MeetingsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/cleaning" element={<CleaningPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/requests" element={<RequestsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
