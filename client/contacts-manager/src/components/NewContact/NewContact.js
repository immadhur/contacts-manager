import React, { Component } from 'react';
import axios from 'axios';
import Spinner from '../UI/Spinner/Spinner';
import Input from '../UI/Input/Input';
import validator from 'validator';

class ContactData extends Component {

    state = {
        contactForm: this.generateContactForm(),
        loading: false,
        addButtonDisabled: true,
        error: ''
    }

    generateContactForm() {
        let contactForm = {
            fName: this.createInputConfig('text', this.props.data?.firstName, 'First Name', { type: 'word' }),
            lName: this.createInputConfig('text', this.props.data?.lastName, 'Last Name', { type: 'word' }),
            email: this.createInputConfig('email', this.props.data?.email, 'Email', { type: 'email' }),
            phone: this.createInputConfig('number', this.props.data?.phone, 'Phone Number', { type: 'mobile' }),
            status: this.createDropdownConfig()
        }
        return contactForm;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.show && !prevProps.show) {
            let form = this.generateContactForm();
            this.setState({ contactForm: form });
        }
    }

    createDropdownConfig() {
        return {
            name: 'Status',
            elementType: 'select',
            elementConfig: {
                options: [
                    { value: 'active', displayValue: 'Active' },
                    { value: 'inactive', displayValue: 'Inactive' }
                ],
                placeholder: 'Status'
            },
            value: this.props.data?.status || 'active',
            validation: {},
            isValid: true
        };
    }

    createInputConfig(inputType, value, name, validations) {
        const config = {
            name,
            elementType: 'input',
            elementConfig: {
                type: inputType,
                placeholder: name
            },
            value: value || '',
            validation: {
                ...validations,
                required: true
            },
            isValid: value ? true : false,
            error: '',
            showErrorOnUI: false
        }
        return config;
    }

    checkValidity(name, value, rules) {
        let error = '';
        if (rules.required) {
            if (value.trim() === '')
                error = `${name} is required!`;
        }
        if (rules.type) {
            switch (rules.type) {
                case 'email':
                    error = validator.isEmail(value) ? '' : 'Email is invalid!';
                    break;
                case 'mobile':
                    error = validator.isMobilePhone(value, "en-IN") ? '' : 'Phone number is invalid!';
                    break;
                case 'word':
                    error = /^[a-zA-Z]+$/.test(value) ? '' : 'Only letters are allowed!';
                    break;
                default:
                    error = '';
            }
        }
        return error;
    }

    orderClickHandler = async (event) => {
        event.preventDefault();
        this.setState({ loading: true });

        let formData = {};
        for (let item in this.state.contactForm) {
            formData[item] = this.state.contactForm[item].value
        }
        const dataToPost = {
            firstName: formData.fName,
            lastName: formData.lName,
            email: formData.email,
            phone: formData.phone,
            status: formData.status
        }
        try {
            this.setState({ loading: true });
            let res
            if (this.props.data)
                res = await axios.patch(`/contact/${this.props.id}`, dataToPost);
            else
                res = await axios.post('/contacts/add', dataToPost);
            this.props.updated();
            this.props.close();
        }
        catch (error) {
            if (error.response?.status === 500)
                this.setState({ error: 'Unable to connect to the server!' });
            else
                this.setState({ error: 'Contact with this number already added!' });
        }
        finally {
            this.setState({ loading: false });
        }
    }

    inputChangedHandler = (event, elementId) => {
        let updatedValue = JSON.parse(JSON.stringify(this.state.contactForm));
        let elementName = updatedValue[elementId].name;
        updatedValue[elementId].value = event.target.value;
        let error = this.checkValidity(elementName, event.target.value, updatedValue[elementId].validation);
        let isValid = true;
        if (error !== '')
            isValid = false;
        updatedValue[elementId].isValid = isValid;
        updatedValue[elementId].error = error;
        let isFormValid = this.checkIsFormValid(updatedValue);
        this.setState({ contactForm: updatedValue, addButtonDisabled: !isFormValid });
    }

    checkIsFormValid(updatedValue) {
        for (let item in updatedValue) {
            let form = updatedValue[item];
            if (!form.isValid) {
                return false;
            }
        }
        return true;
    }

    inputFocusHandler = (ele) => {
        this.setState(prev => ({
            contactForm: {
                ...prev.contactForm,
                [ele]: {
                    ...prev.contactForm[ele],
                    showErrorOnUI: false
                }
            }
        }));
    }

    inputLostFocusHandler = (ele) => {
        this.setState(prev => ({
            ...prev,
            contactForm: {
                ...prev.contactForm,
                [ele]: {
                    ...prev.contactForm[ele],
                    showErrorOnUI: true
                }
            }
        }));
    }

    render() {
        let dataToShow = <Spinner />
        const formData = Object.keys(this.state.contactForm).map(element => {
            const config = this.state.contactForm[element];
            return <Input {...config}
                value={config.value}
                key={element}
                elementConfig={config.elementConfig}
                changed={(event) => this.inputChangedHandler(event, element)}
                focus={() => this.inputFocusHandler(element)}
                lostFocus={() => this.inputLostFocusHandler(element)} />
        })
        if (!this.state.loading) {
            dataToShow = (
                <form onSubmit={this.orderClickHandler} className='form'>
                    {formData}
                    <p className="errorText">{this.state.error}</p>
                    <button disabled={this.state.addButtonDisabled}>{this.props.data ? 'Edit' : 'Add'}</button>
                </form>
            );
        }
        return (
            <div>
                <h2>{this.props.data ? 'Edit Contact' : 'Add Contact'}</h2>
                {dataToShow}
            </div>
        );
    }
}

export default ContactData;