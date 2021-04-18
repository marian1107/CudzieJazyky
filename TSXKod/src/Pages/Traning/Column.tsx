import React from 'react';
import { useDrop } from 'react-dnd';

const Column = ({type, className, uid, style, children}) => {
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
            if (type !== "placeholder")       
                return children.length < 1;
            return true;
        }
    });

    console.log('options', {canDrop, isOver});

    return (
        <div ref={drop} className={className} style={style}>
            {children}
        </div>
    )
}

export default Column;