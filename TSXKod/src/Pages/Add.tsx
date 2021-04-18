import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import FileUploader from 'react-firebase-file-uploader';
import { useSelector } from "react-redux";
import {exercises, firebase as database, rebase} from '../firebase';
import { State } from "../Auth/reducer";




const AddNew = () => {
    
    const [jazyk, setJazyk] = useState("Nemčina");
    const [nazov, setNazov] = useState("");
    const [obr, setObr] = useState([{id:0, url:""}]);
    const [count, setCount] = useState(0);
    const [type, setType] = useState("uhadaj");
    const [uploading, setUploading] = useState(false);
    const activeUser =  useSelector((state: State) => state);

    const history = useHistory();

    const getPocet = () =>{
        if (obr[0] !== undefined && obr[0].id === 0){
            return count + obr.length;
        }
        
        return count + obr.length + 1;
        
    }

    const handleUploadStart = () =>{
        setUploading(true);
      }

      const handleProgress = () =>{
          console.log(uploading);          
      }

      const handleUploadError = (error) => {
        setUploading(false);
        console.error(error);
      }
      
      const handleUploadSuccess = (filename) => {
        if (obr[0] !== undefined && obr[0].id === 0){
            setObr([]);
        }
        exercises.child(`${filename}`).getDownloadURL().then((url) => {
            console.log(url);
            
            
          
            setObr([...obr, {id: getPocet(), url}]);
        }).catch((e)=>console.log(e));
      }

    useEffect(()=>{
        const ref = database.collection('pocet_obrazkov').orderBy('pocet').limit(1);

        ref.get().then((result => {
            const num = result.docs[result.docs.length-1].data().pocet;                                
            setCount(num);                
        }))
    });

    const getAllObr = () => {
        return (
            obr.map((item) => {
                if (item.id !== 0){
                    return (
                        <img
                                key={item.id}
                                style={{width: "150px", height: "100px", objectFit: "fill", border: "1px solid"}}
                                src={item.url}
                                alt={item.id.toString()} />
                        );
                }
                return (
                    <></>
                );                
            })
        );
    }

    const delLast = (ob) =>{
        console.log(obr);
        
        
        setObr(obr.filter(item => item !== ob));
        
    }

    const getObrID = () =>{
        const list : number[] = [];
        obr.forEach(element => {
            if (element.id !==0){
                list.push(element.id);
            }           
        });
        return list;
    }

    const pridaj = () =>{
        console.log(obr);
        
        const id =  activeUser.user.user.uid;
        console.log(activeUser);
        console.log(activeUser.user.user.uid);
        
        
        const obrazky = getObrID();
        console.log(obrazky);
        
        const data ={
            jazyk,
            nazov,
            obrazky,
            id_pouzivatela: id,
            typ: type
          }
          rebase.addToCollection('ulohy', data)          
          .catch(error => {
              console.log(error);                
          });
        const ref = database.collection('pocet_obrazkov'); 
        ref.doc("dWyiuj7gpfx2vXg1yZ6r").update({
            pocet: count + obrazky.length
        }).catch(error => console.log(error)
        ).then(()=>{history.push("/")}).catch(error=>console.log(error)
        )

        
    }

    
    return (
        <div className="Add">
        <div>
        { activeUser.user.logged &&
            <>
            <h1>Pridajte svoju vlastnú úlohu</h1>

            <Form >
                <FormGroup>
                    <Label for="nazov">Názov úlohy</Label>
                    <Input type="text" name="naz" id="nazov" placeholder="Zadajte názov úlohy" value={nazov} onChange={(e) => setNazov(e.target.value)}/>
                </FormGroup>
                <FormGroup>
                    <Label for="jazyk">Vyberte jazyk:</Label>
                    <Input type="select" name="jazyk" id="jazykSelect" value={jazyk} onChange={(e) => setJazyk(e.target.value)}>
                    <option key="op1">Nemčina</option>
                    <option key="op2">Angličtina</option>
                    </Input>
                </FormGroup>
                <FormGroup tag="fieldset">
                    <legend>Vyber kategóriu</legend>
                    <FormGroup check >
                    <Label check>
                        <Input type="radio" name="radio1" value="uhadaj" onChange={(e) => {setType(e.target.value); setObr([{id:0, url:""}])}} defaultChecked/>{' '}
                        Uhádaj
                    </Label>
                    </FormGroup>
                    <FormGroup check>
                    <Label check>
                        <Input type="radio" name="radio1" value="slovosled" onChange={(e) => {setObr([]);setType(e.target.value)}} />{' '}
                        Slovosled
                    </Label>
                    </FormGroup>
                </FormGroup>
                
                <FormGroup>
                    <legend>Nahraté obrázky</legend>
                    <div>
                        {
                            getAllObr()
                        }
                        <Button onClick={() => delLast(obr.pop())}>-</Button>
                    </div>

                    {
                    ((type === "uhadaj" && (obr.length < 2 || (obr[0].id === 0 && obr.length < 3)))
                    ||
                    (type === "slovosled"))
                    &&
                    
                    <FileUploader
                    accept="image/png"
                    name="img"
                    filename={getPocet()}
                    storageRef={exercises}
                    onUploadStart={() => handleUploadStart()}
                    onUploadError={(error) => handleUploadError(error)}
                    onUploadSuccess={(filename) => handleUploadSuccess(filename)}
                    onProgress={() => handleProgress()}
                    />  
                    }
                                            
                </FormGroup>
                
                <Button onClick={() => pridaj()}>Pridaj</Button>

                
            </Form>
        </>
        }
        </div>
        </div>
    );
};


export default AddNew;