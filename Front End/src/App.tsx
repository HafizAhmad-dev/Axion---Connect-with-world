import { Routes, Route } from 'react-router';
import Layout from './Components/Layout';
import Home from './Pages/Conversations';
import Moments from './Pages/Moments';
import RequestsPage from './Pages/RequestsPage';

const App = () => {
  return (
    <div className=''>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/moments' element={<Moments />} />
          <Route path='/requests' element={<RequestsPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
