import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import { Layout } from './components/layout'
import NotFound from "./pages/404/index"
import Login from './pages/auth/login'

import CreateStudent from './pages/student/create'
import StudentsPage from './pages/student'
import ClassesPage from './pages/classes'
import WorksheetsPage from './pages/worksheets'
import CreateWorksheet from './pages/worksheets/create'
import SchoolsPage from './pages/schools'
import CreateSchool from './pages/schools/create'
import TestsPage from './pages/tests'
import CreateTests from './pages/tests/create'
import MembershipsPage from './pages/membership'
import CreateMembership from './pages/membership/create'
import { useEffect, useState } from 'react'
import SchoolEdit from './pages/schools/edit'
import SchoolDetails from './pages/schools/details'
import StudentEdit from './pages/student/edit'
import StudentDetails from './pages/student/details'
import Dashboard from './pages/dashboard'
import AdminSupportTicketsPage from './pages/support'
import AdminPerformance from './pages/performance'
import AdminStudentPerformance from './pages/performance/student'

// Protected Route component that checks for authentication
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const adminAuthToken = localStorage.getItem('adminAuthToken')
      setIsAuthenticated(!!adminAuthToken)
      setIsLoading(false)
    }
    
    checkAuth()
  }, [])

  if (isLoading) {
    // Optional: Show loading spinner while checking authentication
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      {/* Toast Container added here at the application root level */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Routes>
        {/* Auth pages should be outside the Layout and not protected */}
        <Route path='/login' element={<Login />} />
        
        {/* Protected routes with Layout */}
        <Route path='/' element={
          <ProtectedRoute>
            <Layout>
              {/* Default route content can go here if needed */}
              <Navigate to="/students" replace />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path='/performance' element={
          <ProtectedRoute>
            <Layout>
              <AdminPerformance />
            </Layout>
          </ProtectedRoute>
        } />
         <Route path='/performance/:id' element={
          <ProtectedRoute>
            <Layout>
              <AdminStudentPerformance />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path='/students' element={
          <ProtectedRoute>
            <Layout>
              <StudentsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path='/students/create' element={
          <ProtectedRoute>
            <Layout>
              <CreateStudent />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path='/students/:id' element={
          <ProtectedRoute>
            <Layout>
              <StudentDetails />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path='/students/edit/:id' element={
          <ProtectedRoute>
            <Layout>
              <StudentEdit />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path='/classes' element={
          <ProtectedRoute>
            <Layout>
              <ClassesPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path='/worksheets' element={
          <ProtectedRoute>
            <Layout>
              <WorksheetsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path='/worksheets/create' element={
          <ProtectedRoute>
            <Layout>
              <CreateWorksheet />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path='/schools' element={
          <ProtectedRoute>
            <Layout>
              <SchoolsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path='/schools/create' element={
          <ProtectedRoute>
            <Layout>
              <CreateSchool />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path='/schools/edit/:id' element={
          <ProtectedRoute>
            <Layout>
              <SchoolEdit />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path='/schools/:id' element={
          <ProtectedRoute>
            <Layout>
              <SchoolDetails/>
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path='/tests' element={
          <ProtectedRoute>
            <Layout>
              <TestsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path='/tests/create/:id' element={
          <ProtectedRoute>
            <Layout>
              <CreateTests />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path='/memberships' element={
          <ProtectedRoute>
            <Layout>
              <MembershipsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path='/memberships/create' element={
          <ProtectedRoute>
            <Layout>
              <CreateMembership />
            </Layout>
          </ProtectedRoute>
        } />
          <Route path='/support' element={
          <ProtectedRoute>
            <Layout>
              <AdminSupportTicketsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Make sure the wildcard route comes last */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App