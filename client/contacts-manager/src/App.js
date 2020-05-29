import React from 'react';
import './App.css'
import Home from './components/Home/Home';

function App() {
  return (
    <Home loading={false} contacts={[]}/>
  );
}

export default App;
