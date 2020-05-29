const express = require('express');
const router = new express.Router();
const contactModel = require('../model/contact');

router.post('/contacts/add', async (req, res) => {
    try {
        const contact = new contactModel(req.body);
        await contact.save();
        res.status(200).send({
            success: true
        });
    } catch (error) {
        // error=error.errmsg?error.msg:error;
        res.status(400).send({
            success: false,
            error
        })
    }
})

router.get('/contacts', async (req, res)=>{
    try {
        // console.log(req.body);
        const contacts=await contactModel.find();
        res.status(200).send({
            success:true,
            contacts
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            error
        })
    }
});

router.patch('/contact/:id', async (req, res)=>{
    try {
        const contact=await contactModel.findById(req.params.id);
        if(!contact)
            throw 'contact not found!';
            for(let i in req.body){
                contact[i]=req.body[i];
            }
        // contact.data=req.body;
        console.log(contact);
        // await contactModel.findOneAndUpdate({_id:req.params.id});
        await contact.save();
        res.status(200).send({
            success:true
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error
        })
    }
});

router.delete('/contact/:id', async (req, res)=>{
    try {
        const contact=await contactModel.findById({_id:req.params.id});
        if(!contact)
            throw 'contact not found!';
        await contactModel.findByIdAndDelete({_id:req.params.id});
        res.status(200).send({
            success:true
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            error
        })
    }
})

module.exports = router;