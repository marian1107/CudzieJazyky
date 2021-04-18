// https://medium.com/litslink-frontend-development/react-dnd-in-examples-ce509b25839d
import React, { useEffect, useState } from 'react';
import {DndProvider} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import {isMobile} from 'react-device-detect';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { useSelector } from 'react-redux';
import firebase from 'firebase'; 
import { useHistory } from 'react-router';
import { firebase as database, exercises, rebase } from '../../firebase';
import Exercise from './Exercise';
import { State } from '../../Auth/reducer';


const TestSide = () => {
    const [chosen, setChosen] = useState(false);
    const [mode, setMode] = useState("");
    const [count, setCount] = useState(0);
    const [images, setImages] = useState([{}]);
    const [items, setItems] = useState([{id: '', url: '', column:'', color:""}]);
    const [allImages, setAllimages] = useState(false);

    const [ulohy, setUloha] = useState([{id: 0, jazyk: "", nazov: '', obrazky:[], typ:''}]);
    const [uhadnuti, setUhadnutie] = useState([{id: 0, jazyk: "", nazov: '', obrazky:[], typ:''}]);
    const [curr, setOne] = useState({id: 0, jazyk: "", nazov: '', obrazky:[0], typ:''});

    const [curritems, setCurrItems] = useState([{id: '', url: '', column:'', color:""}]);

    const [pokus, setPokus] = useState(0);
    const [uspes, setUspes] = useState(0);

    const activeUser =  useSelector((state: State) => state);

    const history = useHistory();

    const [jazyk, setJazyk] = useState("Nemčina");

    // const [languages, setJazyky] = useState<string[]>([]);

    /* const getJazyk = () => {
        const jazyky:string[] = [];
        ulohy.forEach((item)=>{
            if (!jazyky.includes(item.jazyk)){
                jazyky.push(item.jazyk);
            }
        })

        setJazyky(jazyky);
        return jazyky;
    } */

    useEffect(() => {
        const ref = database.collection('pocet_obrazkov').orderBy('pocet').limit(1);

            ref.get().then((result => {
                const num = result.docs[result.docs.length-1].data().pocet;
                console.log(num);                
                setCount(num);

                const imgs: any =  [];
                
                for (let i = 1; i <= num; i+=1){
                    exercises.child(`${i}.png`).getDownloadURL().then((url) => {
                        console.log();
                        const id = url.split(RegExp('%2F'))[1].split(".")[0];
                        const param = {id, url, column:'0', color:"black"};
                        imgs.push(param);
                                         
                    }).catch((error)=>console.log(error)
                    );
                }
                setImages(imgs);
                setItems(imgs);
                
                console.log(imgs);               
                
                
                
            }))
            
            const uloh: any =  [];
            const uhad: any =  [];
            const ref2 = database.collection('ulohy');
           ref2.get().then(function (result){   
                
            result.forEach(function(child) {  
                const data = child.data(); 
                if (data.typ === "slovosled"){
                    uloh.push({id:child.id, jazyk: data.jazyk, nazov: data.nazov, obrazky: data.obrazky, typ: data.typ});  
                }
                else{
                    uhad.push({id:child.id, jazyk: data.jazyk, nazov: data.nazov, obrazky: data.obrazky, typ: data.typ});  
                }             
                     
                });               
            });
           
            setUloha(uloh);
            setUhadnutie(uhad);

            
            setAllimages(true);
        
    }, []);

    const getItems = (current, mod) =>{
        console.log(mod);
        
        if (mod === "slovosled")
            return items.filter(it=>current.obrazky.includes(Number(it.id)))
        
        let newitems = items.filter(it=>current.obrazky.includes(Number(it.id)));

        const it = newitems[0];
        it.column = it.id; 
        const news = newitems.slice(1, newitems.length)

        newitems = [it, ...news];
               

        while (newitems.length < 5){
            const cu = items[Math.floor(Math.random()*items.length)]
            if (!newitems.includes(cu)){
                // console.log("äsdsdadasdasdasdasdas");
                // console.log(cu);
                
                
                newitems.push(cu);
            }
        }

        // console.log(newitems);
        
        return newitems;

    }

    const chooseOne = (state, ul, uh) =>{  
        let ans = {id: 0, jazyk: "", nazov: '', obrazky:[0], typ:''};
        if (state === "rozpoznaj"){
            // console.log("ROZPOZNAJ");
            const newuh = uh.filter(item=>item.jazyk === jazyk);
            
            ans = newuh[Math.floor(Math.random()*newuh.length)];         
        }
        else{
            const newul = ul.filter(item=>item.jazyk === jazyk);
            ans = newul[Math.floor(Math.random()*newul.length)];            
        }
        const m = getItems(ans, state);
        console.log(m);
        
        setCurrItems(m.sort(()=>Math.random()-0.5)); 

        return ans;
    }

    const set = (stateStr) =>{
        
        setChosen(true);
        setMode(stateStr);
        console.log(
            mode
        );
        setOne(chooseOne(stateStr, ulohy, uhadnuti));              
    }

    console.log(count);
    console.log(ulohy);
    console.log(uhadnuti);    
    console.log(items);
    console.log(images);
    
    
    
    const nextQuestion = () =>{
        console.log(curr);
        let nova = chooseOne(mode, ulohy, uhadnuti);
        // console.log(nova.id);
        // console.log(curr.id);
        for (let i=0; i < items.length; i+=1){ // refaktorizovat cez nejaky currentItems pre ulohu
            items[i].column = "0";
        }

        while (nova.id === curr.id){
            nova = chooseOne(mode, ulohy, uhadnuti);
        }
        
        setOne(nova);
        setPokus(pokus+1);
        setUspes(uspes+1);
    }
    
    const setUlohaPokus = () => {
        setPokus(pokus+1);
        console.log(pokus+1);        
    }

    const endClick = () =>{
        console.log(pokus, "  -  ",uspes);
        console.log(firebase.firestore.Timestamp.fromDate(new Date()));
        
        const data ={
            cas: firebase.firestore.Timestamp.fromDate(new Date()),
            pocet_dobrych_pokusov: uspes,
            pocet_pokusov: pokus,
            pouzivatel: activeUser.user.user.uid,
            uloha: curr.id
          }
          rebase.addToCollection('body', data)          
          .catch(error => {
              console.log(error);                
          }).then(() => {history.push("/")});
    }

    

    return (
        <>
        {activeUser.user.logged === true &&
            <section className="Test">
                {
                    !chosen &&
                    allImages &&
                    <>
                    
                    <div>
                    <h1>Vyber typ úloh</h1>
                        <FormGroup>
                        <Label for="jazyk">Vyberte jazyk:</Label>
                        <Input type="select" name="jazyk" id="jazykSelect" value={jazyk} onChange={(e) => setJazyk(e.target.value)}>                        
                            
                            <option>Nemčina</option>                            
                        
                        </Input>
                        </FormGroup>
                        <div className="buttons">
                            <Button onClick={()=>set("slovosled")}>Slovosled</Button>
                            <Button onClick={()=>set("rozpoznaj")}>Rozpoznaj</Button>
                        </div>
                    </div>
                    </>
                }
                {
                    !chosen &&!allImages &&
                    <div>
                        Práve prebieha načítanie obrázkov z databázy.
                    </div>
                }
                {!isMobile  && 
                chosen &&
                <>
                    <DndProvider backend={HTML5Backend}>                   
                        <Exercise curr={curr} items= {curritems} setItems={setCurrItems} nextQuestion={nextQuestion} setUlohaPokus={setUlohaPokus} endClick={endClick}/>                   
                    </DndProvider>
                    
                </>
                } 
                {isMobile &&    
                chosen &&   
                <>     
                    <DndProvider backend={TouchBackend}>
                        <Exercise curr={curr} items= {curritems} setItems={setCurrItems} nextQuestion={nextQuestion} setUlohaPokus={setUlohaPokus} endClick={endClick}/> 
                    </DndProvider>
                    
                </>
                }

            </section>
        }
        </>
    );
}

export default TestSide;