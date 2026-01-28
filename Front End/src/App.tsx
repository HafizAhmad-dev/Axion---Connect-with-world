import { Routes, Route } from 'react-router';
import Layout from './Layouts/Layout';
import Home from './Pages/Conversations';
import RequestsPage from './Pages/RequestsPage';
import Highlight from './Pages/Highlights';
import AddHighlightSection from './Pages/AddHighlightSection';
import AddHighlightLayout from './Layouts/AddHighlightLayout';
import ChatLayout from './Pages/ChatWindow';

const App = () => {
  return (
    <div className=''>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/user/highlights' element={<Highlight />} />
          <Route path='/user/requests' element={<RequestsPage />} />
        </Route>
       <Route element={<AddHighlightLayout />}>
         <Route path='/user/addHighlights' element={<AddHighlightSection />} />
       </Route>
       <Route path='/user/chat' element={<ChatLayout/>} />
      </Routes>
    </div>
  )
}

export default App
