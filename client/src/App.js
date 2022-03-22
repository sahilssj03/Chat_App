import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage/index';
import ChatPage from './Pages/ChatPage/index';
import ConfirmationHandler from './components/ConfirmationHandler';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<HomePage />} exact />
        <Route path='/chats' element={<ChatPage />} />
        <Route path='/confirm/:Id' element={<ConfirmationHandler />} />
      </Routes>
    </div>
  );
}

export default App;
