const express = require("express")
const verifyToken = require("../middleware/verify-token")
const Hoot = require('../models/hoot.js')
const router = express.Router();

//Public



// protected

router.use(verifyToken)

router.post('/' , async(req,res) =>{
    try{
        req.body.author = req.user._id
        const hoot = await Hoot.create(req.body)
        hoot._doc.author = req.user
        res.status(201).json(hoot)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

router.get("/" , async (req,res) =>{
    try{
        const hoots = await Hoot.find({})
        .populate('author')
        .sort({ createdAt: 'desc' });
        res.status(200).json(hoots);
    }
    catch(err){
        console.log(err)

    }
})

router.get("/:hootId" , async(req,res) =>{
    try{
        const hoot = await Hoot.findById(req.params.hootId).populate('author')
        res.status(200).json(hoot)
    }
    catch(err){
        res.status(500).json(err)
    }
})

router.put("/:hootId" , async(req,res)=>{
    try{
        const hoot = await Hoot.findById(req.params.hootId)

        if(!hoot.author.equals(req.user._id)){
            return res.status(500).send("You cant do it")
        }

        const updateHoot = await Hoot.findByIdAndUpdate(
            req.params.hootId,
            req.body,
            {new: true}
        )

        updateHoot._doc.author = req.user
        res.status(200).json(updateHoot)
    }
    catch(err){
        res.status(500).json(err)
    }
})

router.delete('/:hootId' , async(req,res) =>{
    try{
        const hoot = await Hoot.findById(req.params.hootId)

        if(!hoot.author.equals(req.user._id)){
            return res.status(404).send("you can not delete")
        }
        const deleteHoot = await Hoot.findByIdAndDelete(req.params.hootId)
        res.status(200).json(deleteHoot)
    }
    catch(err){
        res.status(500).json(err)
    }
})

router.post("/:hootId/comments" , async(req,res) =>{
    try{
        req.body.author=req.user._id
        const hoot = await Hoot.findById(req.params.hootId)
        hoot.comments.push(req.body)
        await hoot.save()

        const newComment = hoot.comments[hoot.comments.length -1]

        newComment._doc.author = req.user

        res.status(201).json(newComment)
    }
    catch(err){
        res.status(500).json(err)
    }

})

router.put("/:hootId/comments" , async(req,res)=>{
    const hoot= await Hoot.findById(req.params.hootId)
    const comment = hoot.comments.id(req.params.commentId)
    comment.text
})


module.exports =router