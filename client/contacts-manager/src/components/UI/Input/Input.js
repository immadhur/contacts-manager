import React from 'react';

const Input = (props) => {

    let elementType = null;
    const input = props.elementType;
    let inputElement = <input {...props.elementConfig}
        value={props.value}
        onChange={props.changed}
        onFocus={props.focus}
        onBlur={props.lostFocus} />

    switch (input) {
        case ('input'):
            elementType = inputElement
            break;
        case ('select'):
            elementType = <select value={props.value} onChange={props.changed}>
                {props.elementConfig.options.map(option => (
                    <option key={option.value} value={option.value}>{option.displayValue}</option>
                ))}
            </select>
            break;
        default:
            elementType = inputElement

    }
    return (
        <div className='formItem'>
            <label>{props.name}</label>
            <div className='formInput'>
                {elementType}
                {props.showErrorOnUI ?
                    <label>{props.error}</label> :
                    null
                }
            </div>
        </div>
    );
}

export default Input;