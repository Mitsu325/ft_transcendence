import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "../App";
import HomePage from "../components/HomePage";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" Component={HomePage} />
                {/* <Route path="/" Component={App} /> */}
            </Routes>
        </Router>
    );
}

export default AppRouter;