import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Layout } from './components/layout'
import NotFound from "./pages/404/index"
import Login from './pages/auth/login'
import StudentDetails from './pages/student'
import CreateStudent from './pages/student/create'

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
            <StudentDetails/>
          </Layout>
        }/>
        <Route path='/students/create' element={
          <Layout>
            <CreateStudent/>
          </Layout>
        }/>
          
        {/* Make sure the wildcard route comes last */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App