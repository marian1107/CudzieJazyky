import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody, CardText, CardTitle, CardImg, Progress, Form, FormGroup, Label, Input, FormText} from 'reactstrap';
import FileUploader from 'react-firebase-file-uploader';
import {State} from '../Auth/reducer';
import { profilove, firebase as database } from '../firebase';
import { update } from '../Auth/actions';


const Profil = () => {
    const dispatch = useDispatch();
    const activeUser =  useSelector((state: State) => state);
    const [profileImg, setProfileImg] = useState("");
 //   const [show, setShow] = useState("placeholder.jpg");
    const [uploading, setUploading] = useState(false);

    const [newprez, setPrez] = useState("");

    useEffect(() => {
        let str = "";
        if (activeUser.user.user.obr === undefined){
            setProfileImg("avatar.jpg");
        }
        console.log(activeUser.user.user.obr);
        
        profilove.child(`${activeUser.user.user.obr}.jpg`).getDownloadURL().then((url) => {
            console.log(url);
            
            str = url;
            console.log(str);
            setProfileImg(str);
        }).catch(()=>setProfileImg("avatar.jpg"));
    }, [activeUser.user.user.obr]);

    const getVsetky = () => {
        if (activeUser.user.user.pocet_pokusov === undefined){
            return "0";
        }
        return activeUser.user.user.pocet_pokusov;
    }
    const getSpravnych = () => {
        if (activeUser.user.user.pocet_spravnych_pokusov === undefined){
            return "0";
        }
        return activeUser.user.user.pocet_spravnych_pokusov;
    }

    const submitUpdatePrez = () => {
        const ref = database.collection('users'); 
        ref.doc(activeUser.user.user.uid).update({
            prezivka: newprez,
        }).then( () => {
            dispatch(update({uid: activeUser.user.user.uid, prezivka: newprez, obr: activeUser.user.user.uid}))
        }           
        ).catch(error => console.log(error)
        )
    }

 /*   const handleChange = (event) => {
        setShow(URL.createObjectURL(event.target.files[0]));
    } */

    /* const getImage = () =>{
        let str = "";
        if (activeUser.user.user.obr === undefined){
            setProfileImg("avatar.jpg");
        }
        console.log(activeUser.user.user.obr);
        
        profilove.child(`${activeUser.user.user.obr}.jpg`).getDownloadURL().then((url) => {
            console.log(url);
            
            str = url;
            console.log(str);
            setProfileImg(str);
        });
    } */

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
          let str = "";
        profilove.child(`${filename}`).getDownloadURL().then((url) => {
            console.log(url);
            
            str = url;
            console.log(str);
            setProfileImg(str);
        }).catch(()=>setProfileImg("avatar.jpg"));
      }

    return (
        <>
        { activeUser.user.logged === true &&
            <section className="profil">

                <Card body inverse color="info">
                    
                    <CardBody>
                        <CardTitle tag="h5">{`${activeUser.user.user.prezivka}`}</CardTitle>
                        <CardImg top src={profileImg} />
                        <CardText>Počet pokusov: {`${getVsetky()}`}</CardText>
                        <CardText>Počet správnych pokusov: {`${getSpravnych()}`}</CardText>
                        <Progress
                            bar
                            striped
                            value={getSpravnych()}
                            max={getVsetky()}>
                            {getSpravnych()}
                        </Progress>
                    </CardBody>
                </Card>

                <Form className="block-example border border-dark">
                    <FormGroup>
                        <Label for="exampleEmail">Prezývka</Label>
                        <Input type="text" name="email" id="exampleEmail" onChange={(e) => setPrez(e.target.value)} placeholder={`${activeUser.user.user.prezivka}` } />
                        <Button onClick={submitUpdatePrez}>Submit</Button>
                    </FormGroup>
                    <FormGroup>
                    <Label for="exampleFile">Obrázok</Label>             

                        

                        <FileUploader
                        accept="image/*"
                        name="avatar"
                        filename={activeUser.user.user.uid}
                        storageRef={profilove}
                        onUploadStart={() => handleUploadStart()}
                        onUploadError={(error) => handleUploadError(error)}
                        onUploadSuccess={(filename) => handleUploadSuccess(filename)}
                        onProgress={() => handleProgress()}
                      />

                        <FormText color="muted">
                            Vyberte profilový obrázok
                        </FormText>
                    </FormGroup>

                    
                    
                    
                </Form>
                
            </section>
        }
        </>
    );
};


export default Profil;