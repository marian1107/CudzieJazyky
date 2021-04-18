import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
    NavbarProps, NavItem, NavLink,   
} from 'reactstrap';
import logo from './Images/logo.png';
import './header.css';
import PopUp from './Pages/Modal';

import { State } from './Auth/reducer';
import { logIn, logOut } from './Auth/actions';
import { auth, firebase as database } from './firebase';

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

    useEffect(()=>{
        auth.onAuthStateChanged((result)=>{
            if (result !== null){
                const ref = database.collection('users');  
                ref.get().then(function (users){                   
                    users.forEach(function(child) {
                            if (result.uid === child.id){
                                dispatch(logIn({uid: child.id, prezivka: child.data().prezivka, obr: child.data().obr}));
                            }                
                        });               
                    });
            }
            else{
                dispatch(logOut());
            }
        });
    }, [dispatch])
    
    const activeUser =  useSelector((state: State) => state);
    console.log(activeUser);

    return (
        <>
        <StyledNavbar id="header">
            
            <NavItem>
                <NavLink id="logo" onClick={() => props.history.push('/')}><img src={logo} style={{width: "60px", height: "60px"}} alt="logo"/></NavLink>
            </NavItem>
            

            <StyledNavbar>
                {activeUser.user.logged === true &&
                    <NavItem>
                        <NavLink  id="profil" onClick={() => props.history.push('/profil')}>Profil</NavLink>
                    </NavItem>
                }
                {activeUser.user.logged === true &&
                    <NavItem>
                        <NavLink  id="test" onClick={() => props.history.push('/testovanie')}>Trénovací režim</NavLink>
                    </NavItem>
                }
                {activeUser.user.logged === true &&
                    <NavItem>
                        <NavLink  id="test" onClick={() => props.history.push('/pridanie')}>Pridanie úlohy</NavLink>
                    </NavItem>
                }
                {activeUser.user.logged === false &&
                    <NavItem>
                        <NavLink  id="login" onClick={() => {togglePopUp(showPopUp); console.log(showPopUp);
                        }}>Prihlásenie</NavLink>
                    </NavItem>
                }
                {activeUser.user.logged === true &&
                    <NavItem>
                        <NavLink  id="logout" onClick={() => {dispatch(logOut()); if (showPopUp === true){
                            togglePopUp(showPopUp);
                        }
                        auth.signOut();
                        props.history.push('/');
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
