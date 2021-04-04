// https://medium.com/litslink-frontend-development/react-dnd-in-examples-ce509b25839d
import React, { useEffect, useState } from 'react';
import {DndProvider, useDrop} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import {isMobile} from 'react-device-detect';
import { Button } from 'reactstrap';
import { firebase as database, exercises } from '../../firebase';
import MovableItem from './Dragged';

const Column = ({className, title, uid, children}) => {
    const [{canDrop, isOver}, drop] = useDrop({
        accept: 'BOX',
        drop: (item) => {
            console.log(item);
            // console.log(uid);
            console.log({mid: uid});
            
            return {mid: uid};
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
        canDrop :() =>{           
            return children.length < 1;
        }
    });

    console.log('options', {canDrop, isOver});

    return (
        <div ref={drop} className={className} style={{height: '100px', display: "flex"}}>
            {title}
            {children}
        </div>
    )
}

const ColumnPlaceHolder = ({children, className, title, uid}) => {
    const [{canDrop, isOver}, drop] = useDrop({
        accept: 'BOX',
        drop: (item) => {
            console.log(item);
            // console.log(uid);
            console.log({mid: uid});
            
            return {mid: uid};
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    console.log('options', {canDrop, isOver});

    return (
        <div ref={drop} className={className} style={{height: '15vw'}}>
            {title}
            {children}
        </div>
    )
}


const TestSide = () => {
    const [chosen, setChosen] = useState(false);
    const [mode, setMode] = useState("");
    const [count, setCount] = useState(0);
    const [images, setImages] = useState([{}]);
    const [items, setItems] = useState([{id: '', url: '', column:''}]);
    const [allImages, setAllimages] = useState(false);
    // const [setcurrent, setCurrent] = useState(false);
    // const [loadUlohy, setLoadUlohy] = useState(false);

    const [ulohy, setUloha] = useState([{jazyk: "", nazov: '', obrazky:[], typ:''}]);
    const [uhadnuti, setUhadnutie] = useState([{jazyk: "", nazov: '', obrazky:[], typ:''}]);
    const [curr, setOne] = useState({jazyk: "", nazov: '', obrazky:[], typ:''});

    // const [columns, setColumns] = useState([{}]);
    // const [boxes, setBoxes] = useState({title: '', className: '', uid: ''});
    
  /*  const generateOne = (mod) =>{
        const uloh: any =  [];
        console.log(mod);
        
        if (mod === "order"){
            
            const ref = database.collection('ulohy').where("typ", "==", "slovosled");
           ref.get().then(function (result){   
            console.log(result);    
            result.forEach(function(child) {  
                const data = child.data();              
                  uloh.push({jazyk: data.jazyk, nazov: data.nazov, obrazky: data.obrazky, typ: data.typ});     
                });               
            });
            
        }
        else{
            const ref = database.collection('ulohy').where("typ", "==", "rozpoznaj");
            ref.get().then(function (result){   
                
                result.forEach(function(child) {  
                    const data = child.data();              
                      uloh.push({jazyk: data.jazyk, nazov: data.nazov, obrazky: data.obrazky, typ: data.typ});     
                });               
            });
        }
        console.log(uloh);
        
        // console.log(uloh[0]);
        // console.log(ulohy);
        
        
        setUloha(uloh);
        console.log(ulohy);
        
        
    } */
    const returnItemsForColumn = (columnId) => {
        console.log(items);
        
        
        return items
            .filter((item) => { console.log(item.id); return item.column === columnId;})
            .map((item) => (
                <MovableItem
                            key={item.id} 
                            id={item.id}
                             url= {item.url}
                             setItems={setItems}
                />
            ))
    }
    const set = (stateStr) =>{
        
        setChosen(true);
        setMode(stateStr);
        console.log(
            mode
        );
                      
    }
    
    

    /* const returnColumns = () => {
        // console.log(columns);
        console.log(current);
        
        
        
    } */

    

    

    useEffect(() => {
        const ref = database.collection('pocet_obrazkov').orderBy('pocet').limit(1);

            ref.get().then((result => {
                const num = result.docs[result.docs.length-1].data().pocet;
                console.log(num);                
                setCount(num);
                // console.log(count);

                const imgs: any =  [];
                
                for (let i = 1; i <= num; i+=1){
                    exercises.child(`${i}.png`).getDownloadURL().then((url) => {
                        console.log();
                        const id = url.split(RegExp('%2F'))[1].split(".")[0];
                        const param = {id, url, column:'0'};
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
            // console.log(result);    
            result.forEach(function(child) {  
                const data = child.data(); 
                if (data.typ === "slovosled"){
                    uloh.push({jazyk: data.jazyk, nazov: data.nazov, obrazky: data.obrazky, typ: data.typ});  
                }
                else{
                    uhad.push({jazyk: data.jazyk, nazov: data.nazov, obrazky: data.obrazky, typ: data.typ});  
                }             
                     
                });               
            });
            // console.log(uloh);
            setUloha(uloh);
            setUhadnutie(uhad);

            
            setAllimages(true);
        /* exercises.child(`${count}.jpg`).getDownloadURL().then((url) => {
            console.log(url);
            
            str = url;
            console.log(str);
            setProfileImg(str);
        }).catch(()=>setProfileImg("avatar.jpg")); */
    }, []);

    console.log(count);
    
    console.log(images);
    console.log(ulohy);
    console.log(uhadnuti);
    
    console.log(curr);
    
    const chooseOne = (state, ul, uh) =>{
        console.log(ulohy);
        set(state);
        // let a = {jazyk: "", nazov: '', obrazky:[], typ:''};
        if (state === "know"){
            return uh[Math.floor(Math.random()*uhadnuti.length)];           
        }
       
        //   console.log(ulohy[Math.floor(Math.random()*uhadnuti.length)]);
           
            return ul[Math.floor(Math.random()*ulohy.length)];    
        
        // const cols:any = [];
        /* for (let i=0; i < a.obrazky.length; i+=1){
            cols.push({id: a.obrazky[i]});
        } */
       // console.log();
        
        
        // setColumns(cols);
       
      
    }

    
    return (
        <section className="Test">
            {
                !chosen &&
                 allImages &&
                 
                <div>
                    <Button onClick={()=>{setOne(chooseOne("order", ulohy, uhadnuti));  }}>Slovosled</Button>
                    <Button onClick={()=>{setOne(chooseOne("order", ulohy, uhadnuti)); }}>Rozpoznaj</Button>
                </div>
            }
            {
                !chosen &&!allImages &&
                <div>
                    Práve prebieha načítanie obrázkov z databázy.
                </div>
            }
            {!isMobile  && 
            chosen &&
            curr &&
                <DndProvider backend={HTML5Backend}>
                    {
                    
                    curr.obrazky.filter(item=>item)
                        .map((item) => (
                            <Column
                                        key={item} 
                                        uid={item}
                                        className={`Column, ${item}`}
                                        title={item}
                            >
                            {returnItemsForColumn(item)}
                    </Column>
                )) }
                    <Button onClick={()=>{setOne(chooseOne("order", ulohy, uhadnuti))}}>Next</Button>
                    <ColumnPlaceHolder title='Column 2' className='column second-column' uid="0">                    
                        {returnItemsForColumn("0")}
                    </ColumnPlaceHolder>
                    { `${curr.obrazky}`}
                </DndProvider>
            } 
            {isMobile &&
            chosen &&
            
                <DndProvider backend={TouchBackend}>
                    <div>
                        asdasdasdasd
                        
                    </div>
                </DndProvider>
            }

            {!isMobile  && 
            chosen &&
            !curr &&
                <div>Nedali načítať informácie o kvízu. Načítajte stránku znova a počkajte jednu sekundu.</div>
            } 

        </section>
    );
}

export default TestSide;