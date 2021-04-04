import React, { useState } from 'react';
import { Button, Col, Input, Nav, NavItem, NavLink, Row, TabContent, TabPane  } from 'reactstrap';
import styled from 'styled-components';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
// import { useHistory } from 'react-router';
import { auth, rebase, firebase as database } from '../firebase';
import { logIn, registrate } from '../Auth/actions';
import { State } from '../Auth/reducer';




// import { registrate } from '../Auth/actions';

const StyledNavbar = styled.div`
    background: lightgray;
    display: flex;
    padding: 0 30px;
    height: 30px%;
`;

const PopUp = (props) => {
    // const history = useHistory();
    const dispatch = useDispatch();

    const { close } = props;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [activeTab, setActiveTab] = useState("1");

    const [prezivka, setPrezivka] = useState("");

    const [uid, setPouz] = useState("");

    // console.log(useSelector((state: State) => state));
    const activeUser =  useSelector((state: State) => state);
    console.log(activeUser);

    const toggle = tab  => {
        if (activeTab !== tab)
            setActiveTab(tab);        
    }

    
    const loginfunc = () => {
        auth.signInWithEmailAndPassword(email, password).then((result)=>{
            // const str = `"users/"${result.user?.uid}`  
            // console.log(str);
            const ref = database.collection('users');  
            console.log(ref.get().then(function (users){
                
                
            users.forEach(function(child) {
                    if (result.user?.uid === child.id){
                        setPouz(child.id);      
                        
                        console.log({uid, ...child.data()});                    
                        console.log(child.id);
                        dispatch(logIn({uid: child.id, prezivka: child.data().prezivka, obr: child.data().obr}));
                    }                
                });               
            }));
            /* rebase.get(str, {context: this
                
            }).then((user) => {
                console.log("asdasdasdasdasdasdas");
                
                
                console.log(user);
                }).catch(error => { console.log(error)});
            
            }).catch(error => {
                console.log(error);
                */

                // history.push("/profile");
                
            });        
                
    } 

    const reg = () => {
        auth.createUserWithEmailAndPassword(email, password).then((res) => {
            const data ={
              prezivka,
            }
            rebase.addToCollection('users', data, res.user?.uid)
            .then((user) => {
                dispatch(registrate({uid: res.user?.uid, ...data}));
                console.log(user);
                
                }).catch(error => {
                    console.log(error);
                });
            }).catch(error => {
                console.log(error);                
            });
        
    } 
    // https://reactstrap.github.io/components/tabs/
    return (
        <>
            {
            activeUser.user.logged !== true &&
            
            <div className="popup">
            <div className="popup_inner">
                <StyledNavbar>
                    <Nav tabs style={{display: "flex", alignItems: "column", justifyContent: "space-around", width: "100%"}}>
                        <NavItem>                    
                            <NavLink style={{color: "black",textDecoration: 'none'}} className={classnames({active: activeTab === "1"})} onClick={() => {toggle("1"); console.log(activeTab);
                            }}>Prihlásenie</NavLink>                    
                        </NavItem>
                        <NavItem>                    
                            <NavLink style={{color: "black",textDecoration: 'none'}} className={classnames({active: activeTab === "2"})} onClick={() => {toggle("2"); console.log(activeTab);
                            }}>Registrácia</NavLink>
                        </NavItem>
                    </Nav>
                </StyledNavbar>

                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                        <Row className="m-t-10">
                        E-mail:
                            <Col sm="8">
                                <div className="flex">
                                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <Row className="m-t-10">
                        Password:
                            <Col sm="8">
                            <div className="flex">
                                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            </Col>
                        </Row>
                        <Col className="m-t-10" style={{display:"flex", justifyContent:"space-between"}}>
                            <Button onClick={loginfunc}>Potvrdiť</Button>
                            <Button onClick={close}>Späť</Button>
                        </Col>
                    </TabPane>
                    <TabPane tabId="2">
                        <Row className="m-t-10">
                        E-mail:
                            <Col sm="8">
                                <div className="flex">
                                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </Col>
                        </Row>
                        <Row className="m-t-10">
                        Password:
                            <Col sm="8">
                            <div className="flex">
                                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            </Col>
                        </Row>
                        <Row className="m-t-10">
                        Prezívka:
                            <Col sm="8">
                            <div className="flex">
                                <Input type="text" value={prezivka} onChange={(e) => setPrezivka(e.target.value)} />
                            </div>
                            </Col>
                        </Row>
                        <Col className="m-t-10" style={{display:"flex", justifyContent:"space-between"}}>                            
                            <Button onClick={reg}>Reg</Button>
                            <Button onClick={close}>Späť</Button>
                        </Col>
                    </TabPane>
                </TabContent>               
                     
            </div>
        </div>
        }
        </>
    );
   
}

export default PopUp;
