import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from './Home.module.css';
import NewContact from '../NewContact/NewContact';
import DialogBoxModel from '../UI/DialogBoxModel/DialogBoxModel';
import Navigation from '../Navigation/Navigation';
import ListContacts from '../Contact/ListContacts';
import Spinner from '../UI/Spinner/Spinner';

const Home = (props) => {
    let [isNewContactDialogVisible, setisNewContactDialogVisible] = useState(false);
    let [isEditContactDialogVisible, setisEditContactDialogVisible] = useState(false);
    let [errorDialogVisibility, setErrorDialogVisibility] = useState(false);
    let [currentContactData, setCurrentContactData] = useState('');
    let [currentKey, setCurrentKey] = useState('');
    let [loading, setLoading] = useState(false);
    let [contacts, setContacts] = useState([]);
    let [error, setError] = useState('');
    let [dataUpdated, setDataUpdated] = useState(false);

    useEffect(()=>{
        getContacts();
    }, [])

    useEffect(() => {
        if (!isNewContactDialogVisible && dataUpdated)
            getContacts();
    }, [isNewContactDialogVisible, dataUpdated])

    useEffect(() => {
        if (!isEditContactDialogVisible && dataUpdated)
            getContacts();
    }, [isEditContactDialogVisible, dataUpdated])

    const getContacts = async () => {
        try {
            setLoading(true);
            let res = await axios.get('/contacts');
            if (res)
                setContacts(res.data.contacts);
        } catch (error) {
            if (error.response.status === 500)
                setError('Unable to get response from server')
            else
                setError('Unable to get contacts!')
            setErrorDialogVisibility(true);
        } finally {
            setLoading(false);
        }
    }

    const newContactDialogCloseHandler = () => {
        setisNewContactDialogVisible(false);
    }

    const editDialogCloseHandler = () => {
        setisEditContactDialogVisible(false);
    }

    const showNewContactDialogHandler = () => {
        setDataUpdated(false);
        setisNewContactDialogVisible(true);
    }

    const deleteContactHandler = async (key) => {
        try {
            setLoading(true);
            await axios.delete(`/contact/${key}`);
            await getContacts();
        }
        catch (error) {
            if (error.response.status === 500)
                setError('Unable to get response from server')
            else
                setError('Unable to get contacts!')
        }
        finally {
            setLoading(false);
        }
    }


    const editContactHandler = (key) => {
        const data = contacts.filter(contact => contact._id === key)[0]
        setDataUpdated(false);
        setCurrentKey(key);
        setCurrentContactData(data);
        setisEditContactDialogVisible(true);
    }

    const dataUpdateHandler=()=>{
        setDataUpdated(true);
    }

    let editContact = <DialogBoxModel show={isEditContactDialogVisible} close={editDialogCloseHandler}>
        <NewContact updated={dataUpdateHandler} show={isEditContactDialogVisible} id={currentKey} close={editDialogCloseHandler} data={currentContactData} />
    </DialogBoxModel>;

    const newcontact = <DialogBoxModel show={isNewContactDialogVisible} close={newContactDialogCloseHandler}>
        <NewContact updated={dataUpdateHandler} close={newContactDialogCloseHandler} />
    </DialogBoxModel>

    const errorDialog = <DialogBoxModel show={errorDialogVisibility} close={() => setErrorDialogVisibility(false)}>
        <p style={{ textAlign: "center" }}>{error}</p>
    </DialogBoxModel>

    return (
        <>
            {errorDialog}
            <Navigation />
            {loading ? <Spinner /> :
                <div className={style.body}>
                    <>
                        {newcontact}
                        {editContact}
                        <button onClick={showNewContactDialogHandler} className={style.floatingButton}>+</button>
                    </>
                    {contacts.length > 0 ?
                        <ListContacts contacts={contacts} delete={deleteContactHandler} edit={editContactHandler} />
                        :
                        <p className={style.noContacts}>No Contacts Found</p>}
                </div>
            }
        </>
    );
}

export default Home