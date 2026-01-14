import { Routes, Route } from 'react-router';
import Layout from './Components/Layout';
import Home from './Pages/Conversations';
import RequestsPage from './Pages/RequestsPage';
import Highlight from './Pages/Highlights';

const App = () => {
  return (
    <div className=''>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/highlights' element={<Highlight />} />
          <Route path='/requests' element={<RequestsPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
