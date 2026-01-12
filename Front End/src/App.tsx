import { Routes, Route } from 'react-router';
import Layout from './Components/Layout';

const App = () => {
  return (
    <div className=''>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<div>Home</div>} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
