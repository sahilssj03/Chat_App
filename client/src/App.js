import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage/index';
import ChatPage from './Pages/ChatPage/index';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<HomePage />} exact />
        <Route path='/chats' element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
