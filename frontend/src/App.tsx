import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";

import Home from "./components/home";
import Login from "./components/login";
import Signup from "./components/signup";
import Account from "./components/account";
import Following from "./components/following";
import CreatePost from "./components/create-post";
import Navbar from "./components/navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Route path="/" exact component={Home} />
      <Route path="/login" exact component={Login} />
      <Route path="/signup" exact component={Signup} />
      <Route path="/account" exact component={Account} />
      <Route path="/following" exact component={Following} />
      <Route path="/create-post" exact component={CreatePost} />
    </Router>
  );
}

export default App;
