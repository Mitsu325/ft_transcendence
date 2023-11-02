import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

const App = () => {
    return (
        <Routes>
            <Route path="/" Component={Home} />
            <Route path="/login" Component={Signin} />
            <Route path="/signup" Component={Signup} />
        </Routes>
    );
}

export default App;