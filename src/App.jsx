import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Layout } from './components/layout'
import NotFound from "./pages/404/index"
import { TestCard } from './components/card'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<TestCard details={{
            title: "Prelims",
            subject: 'Science',
            questions: 10,
            studentsTook : 20,
            status: 'published'
          }} />} />
        </Route>
        <Route path='/404' element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
