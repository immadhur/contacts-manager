require('dotenv').config();
const express=require('express');
const cors=require('cors');
const app=express();
const port=process.env.PORT||4000;
require('./src/db/mongoose');
const contactsRouter=require('./src/routers/contacts');
const path=require('path');

app.use(express.json())
app.use(cors());
app.use(contactsRouter);

app.use(express.static(path.join(__dirname, '/client/contacts-manager/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/contacts-manager/build/index.html'));
    });;

app.listen(port, ()=>{
    console.log('Server is running on port '+port);
});

module.exports=app;