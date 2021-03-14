
import React from "react";
import "./App.css";
// import axios from "axios";
// import Cookies from "js-cookie";
import Login from "./Login";
import Users from "./Users";

import {  BrowserRouter, Switch, Route } from "react-router-dom";

function App() {

  return (

    <div className="App">
      <BrowserRouter>

     
        <Switch>

          <Route exact path="/" component={Login} />
          <Route exact path="/users" component={Users} />
         

        </Switch>
      </BrowserRouter>

    </div>
  );
}

export default App;
