import React from 'react';
import {Route} from 'react-router-dom';
import NavBar from './Navigation';
import Footer from './Footer';
import Home from './Pages/Home';
import Profil from './Pages/Profil';
import TestSide from './Pages/Traning/Test';

const NavRoute = () => {    
    return(
        <>
        <Route path='/' component = {NavBar}/>
        <Route path='/profil' component={Profil}/>
        <Route path='/testovanie' component={TestSide}/>
        <Route exact path='/' component={Home} />        
        <Route path='/' component = {Footer}/>
        </>
    )      
  };

export default NavRoute;