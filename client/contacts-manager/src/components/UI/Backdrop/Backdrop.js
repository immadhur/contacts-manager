import React from 'react';
import style from './Backdrop.module.css'

const backdrop=(props)=>(
    props.isVisible?<div className={style.Body} onClick={props.click}></div>:null
);

export default backdrop;