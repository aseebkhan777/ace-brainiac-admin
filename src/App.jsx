import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Layout } from './components/layout'
import NotFound from "./pages/404/index"
import Login from './pages/auth/login'
import StudentDetails from './pages/student/student'
import CreateStudent from './pages/student/create'
import StudentsPage from './pages/student'
import ClassesPage from './pages/classes'
import WorksheetsPage from './pages/worksheets'
import CreateWorksheet from './pages/worksheets/create'
import SchoolsPage from './pages/schools'
import CreateSchool from './pages/schools/create'
import TestsPage from './pages/tests'
import CreateTests from './pages/tests/create'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages should be outside the Layout */}
        <Route path='/login' element={<Login/>}/>
        
        {/* Main application routes with Layout */}
        <Route path='/' element={
          <Layout>
            {/* Default route content can go here if needed */}
          </Layout>
        } />
        
        <Route path='/students' element={
          <Layout>
            <StudentsPage/>
          </Layout>
        }/>
        <Route path='/students/create' element={
          <Layout>
            <CreateStudent/>
          </Layout>
        }/>
        <Route path='/students/:id' element={
          <Layout>
            <StudentDetails/>
          </Layout>
        }/>
        <Route path='/classes' element={
          <Layout>
            <ClassesPage/>
          </Layout>
        }/>
        <Route path='/worksheets' element={
          <Layout>
            <WorksheetsPage/>
          </Layout>
        }/>
        <Route path='/worksheets/create' element={
          <Layout>
            <CreateWorksheet/>
          </Layout>
        }/>
        <Route path='/schools' element={
          <Layout>
            <SchoolsPage/>
          </Layout>
        }/>
        <Route path='/schools/create' element={
          <Layout>
            <CreateSchool/>
          </Layout>
        }/>
        <Route path='/tests' element={
          <Layout>
            <TestsPage/>
          </Layout>
        }/>
        <Route path='/tests/create/:id' element={
          <Layout>
            <CreateTests/>
          </Layout>
        }/>
          
        {/* Make sure the wildcard route comes last */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App