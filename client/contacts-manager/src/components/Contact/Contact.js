import React from 'react';
import style from './Contact.module.css'

const Contact = (props) => {
    return (
        <div className={style.body}>
            {/* <div className={style.outer}> */}
                <div className={style.contactDetails}>
                    <p>{props.data.firstName} {props.data.lastName}</p>
                    <p>{props.data.email}</p>
                    <p>Status: {props.data.status}</p>
                    <p className={style.number}>{props.data.phone}</p>
                </div>
            {/* </div> */}
            <div>
                <button className={style.editBtn} onClick={props.editClick}>Edit</button>
                <button className={style.dltBtn} onClick={props.deleteClick}>Delete</button>
            </div>
        </div>
    )
}

export default Contact;