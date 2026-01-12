import { Routes, Route } from 'react-router';
import Layout from './Components/Layout';
import Home from './Components/Conversations';

const App = () => {
  return (
    <div className=''>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
