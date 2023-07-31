import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import NotFound from "./components/NotFound";
import Auctions from "./components/Auctions";
import Home from "./components/Home";
import AuctionDetails from "./components/AuctionDetails"
import Account from "./components/Account"


function App() {
  return (
      <div className="App">
        <Router>
          <div>
            <Routes>
              <Route path="/Login" element={<Login/>}/>
              <Route path="/Register" element={<Register/>}/>
              <Route path="/Auction" element={<Home/>}/>
              <Route path="/Auction/:id" element={<AuctionDetails/>}/>
              <Route path="/Account/:id" element={<Account/>}/>
              <Route path="*" element={<NotFound/>}/>
            </Routes>
          </div>
        </Router>
      </div>
  );
}
export default App;