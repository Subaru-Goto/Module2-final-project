import React from 'react';
import './App.css';
import {Route, Routes } from 'react-router-dom';
import { CreateAccount } from './pages/CreateAccount';
import { ConnectWallet } from './pages/ConnectWallet';
import { TransferSol } from './pages/TransferSol';

function App() {
  return (
    <body>
      <header>
        <h1 style={{           
            position:"relative",
            top:"50%",
            left:"43%",}}>
          MetaCrafters Challenge 5
        </h1>
      </header>
      <Routes>
        /**Set CreateWallet page as a root */
        <Route path="/" element={<CreateAccount />} />
        <Route path="/connect" element={<ConnectWallet />} />
        <Route path="/transfer" element={<TransferSol />} />
      </Routes>
    </body>
)}

export default App;
