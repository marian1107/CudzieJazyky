import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import NavRoute from './NavRoute';

const App: React.FC = () => {
    return (
        <>
            <BrowserRouter>
                <Route path="/" component={NavRoute} />
            </BrowserRouter>
        </>
    );
};

export default App;
