import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
    NavbarProps, NavItem, NavLink,   
} from 'reactstrap';
import logo from './Images/logo.png';
import './header.css';
import PopUp from './Pages/Modal';

import { State } from './Auth/reducer';
import { logOut } from './Auth/actions';

const StyledNavbar = styled.div`
    color: green;
    background: lightgray;
    display: flex;
    padding: 0 30px;
    align-items: center;
    justify-content: space-between;
`;

const NavBar: React.FC<NavbarProps> = (props: any) => {
    const [showPopUp, setshowPopUp] = useState(false);
    const dispatch = useDispatch();

    const togglePopUp = (variant: boolean) =>{
        
        setshowPopUp(!variant);

        
    };
    
    const activeUser =  useSelector((state: State) => state);
    console.log(activeUser);

    return (
        <>
        <StyledNavbar>
            
            <NavItem>
                <NavLink style={{color: "black"}} id="logo" onClick={() => props.history.push('/')}><img src={logo} style={{width: "60px", height: "60px"}} alt="logo"/></NavLink>
            </NavItem>
            

            <StyledNavbar>
                {activeUser.user.logged === true &&
                    <NavItem>
                        <NavLink style={{color: "black", textDecoration: 'none'}} id="profil" onClick={() => props.history.push('/profil')}>Profil</NavLink>
                    </NavItem>
                }
                {activeUser.user.logged === true &&
                    <NavItem>
                        <NavLink style={{color: "black", textDecoration: 'none'}} id="test" onClick={() => props.history.push('/testovanie')}>Trénovací režim</NavLink>
                    </NavItem>
                }
                {activeUser.user.logged === false &&
                    <NavItem>
                        <NavLink style={{color: "black",textDecoration: 'none'}} id="login" onClick={() => {togglePopUp(showPopUp); console.log(showPopUp);
                        }}>Prihlásenie</NavLink>
                    </NavItem>
                }
                {activeUser.user.logged === true &&
                    <NavItem>
                        <NavLink style={{color: "black",textDecoration: 'none'}} id="logout" onClick={() => {dispatch(logOut()); if (showPopUp === true){
                            togglePopUp(showPopUp);
                            props.history.push('/');
                        }
                        }}>Odhlásenie</NavLink>
                    </NavItem>
                }

                
            </StyledNavbar>
        </StyledNavbar>
        {showPopUp ? 
            <PopUp        
            close={togglePopUp}
          />
            : null
          }

        </>

        
    );
};

export default NavBar;
