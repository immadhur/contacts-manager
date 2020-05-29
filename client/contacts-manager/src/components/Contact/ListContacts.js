import React from 'react';
import Contact from './Contact';

const ListContacts=(props)=>{

    return(
        <div className='contactsList'>
            {props.contacts.map(contact=>{
                return <Contact key={contact._id} deleteClick={()=>props.delete(contact._id)} 
                editClick={()=>props.edit(contact._id)} data={contact}/>
            })}
        </div>
    );
}

export default ListContacts;