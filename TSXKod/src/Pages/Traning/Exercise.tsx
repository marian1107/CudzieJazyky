import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import { useSelector } from 'react-redux';
import Column from './Column';
import MovableItem from './Dragged';
import star from '../../Images/star.jpg';
import { State } from '../../Auth/reducer';
import { firebase as database, rebase} from '../../firebase';


const Exercise = ({items, curr, setItems, nextQuestion, setUlohaPokus, endClick}) =>{
    console.log(
        nextQuestion
    );
    console.log(items);
    
    const [answer, setAnswer] = useState({});
    const [rating, setRating] = useState(0);

    const activeUser =  useSelector((state: State) => state);

    
    

    useEffect(() => {
        const m = {};
        curr.obrazky.forEach(element => {
            m[element] = "lightgray";
        });
                
        setAnswer(m);
        console.log(activeUser.user.user.uid);

        const ref = database.collection('hodnotenia').where("pouzivatel", "==", activeUser.user.user.uid).where("uloha", "==", curr.id);

            ref.get().then((result => {
                const data = result.docs[result.docs.length-1];
                if (data !== undefined){
                    setRating(data.data().bod);   
                }
            }))            
            
      }, [items, curr.obrazky, activeUser.user.user.uid, curr.id])

    console.log(rating);
    
      console.log(answer);

      console.log(curr.obrazky);
      

    const recolor = () => {
        const m = {};
        let ass = true;
        curr.obrazky.forEach(element => {
            console.log(element);
            // console.log(items.filter(e => Number(e.column) === element));
            const el = items.find(e => Number(e.column) === element);
            console.log(el);
            
            
            if (el !== undefined && el.column === el.id){
                m[el.column] = "green";
            }
            else{
                m[element] = "red";
                ass=false;
            }           
          
        });

        setAnswer(m);
        console.log(answer);
        return ass;
    }

    const rate = (num) =>{
        

        const data ={
            bod: num,
            pouzivatel: activeUser.user.user.uid,
            uloha: curr.id
          }
          rebase.addToCollection('hodnotenia', data)          
          .catch(error => {
              console.log(error);                
          }).then(() => {setRating(num);});
    
    }

    const returnItemsForColumn = (columnId) => {
        console.log(columnId);
        
        console.log(items);
        
        
        return items
            .filter((item) => { /* console.log(item.id); */ return item.column === columnId;})
            .map((item) => (
                <MovableItem
                            key={item.id} 
                            id={item.id}
                             url= {item.url}
                             setItems={setItems}
                             style={{height: '80px', width:"100px", objectFit: "contain", borderStyle: "solid", borderColor: item.color, backgroundColor: "white"}}
                />
            ))
    }

    return (
        <>
        {
            curr.typ === "slovosled" &&
            <h1>Usporiadaj slová v úlohe: {curr.nazov}</h1>
        }
        {
            curr.typ === "uhadaj" &&
            <h1>Uhádaj slovo: {curr.nazov}</h1>
        }
        
        <div className="places" >
        {curr.obrazky.filter(item=>item)
            .map((item) => (
                
                <Column
                            key={item} 
                            uid={String(item)}
                            className={`Column, ${item}`}
                            type="column"
                            style={{marginTop: "10px",height: '100px', width:"120px", display: "flex", border:"solid", borderWidth:"1px", alignItems:"center", justifyCotent:"space-around", backgroundColor:answer[item]}}
                >
                    {returnItemsForColumn(String(item))}
                </Column>
    )) }
    </div>
        
        <Column type = "placeholder" className='second-column' uid="0" style={{}}>                    
            { 
            returnItemsForColumn("0")
            }
        </Column>
        
        {rating === 0 &&
        <div style={{display: "flex", justifyContent:"center", alignItems:"center"}}> 
            Hodnotenie úlohy: 
            {[1, 2, 3, 4, 5].map(
                (item)=><Button key={item} style={{backgroundColor:"white", borderStyle:"none"}} onClick={() => {rate(item)}}><img src={star} style={{width: "25px", height: "25px"}} alt="star"/></Button>
            )            
            }
        </div>
        }
        {rating !== 0 &&
        <p>Hodnotili ste úlohu na {rating} bodov.</p> 
        }
        
        <div className="buttons">
        <Button onClick={() => {
            if (recolor()){
                nextQuestion();
                setRating(0);
            }
            else{
                setUlohaPokus();
            }
            /* nextQuestion(); */ console.log(curr);
            }}>Next</Button>

            <Button onClick={() => endClick()}>Koniec</Button>
        </div>
        </>
    )



    
    
}

export default Exercise;