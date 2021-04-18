import React from 'react';
import { DragSourceMonitor, useDrag } from "react-dnd";
// https://react-dnd.github.io/react-dnd/docs/api/hooks-overview

const MovableItem = ({id, url, setItems, style}) => {        
    const changeColumn = (item, columnName) => {
        setItems((prevState) => {
            return prevState.map(e => {
                return {
                    ...e,
                    column: e.id === item.id ? columnName : e.column
                }
            });
        });
    };

    const [{isDragging}, drag] = useDrag({
        item: {id, url},
        type: 'BOX',
        end: (item, monitor:DragSourceMonitor) => {
            console.log(item);
            
            const dropResult = monitor.getDropResult();
            
            if (dropResult === null){
                return;
            };
            console.log((dropResult as any ).mid);
            changeColumn(item, (dropResult as any).mid);
                  
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const opacity = isDragging ? 0.4 : 1;
    

    return (
        <div ref={drag} className='movable-item' style={{opacity}}>
            <img src={url} style={style} alt="img"/>       
        </div>
    )
}
export default MovableItem;