import express from 'express';
import bcrypt from "bcrypt";
import Candidate from '../models/candidate.js';
import User from '../models/user.js';
import jwt from "jsonwebtoken";
import jwtAuth from '../middleware/jwtAuth.js';
import mongoose from 'mongoose';

const router = express.Router();

//candidate data saved
router.post('/', jwtAuth, async (req,res)=>{
    try{
        //first check the role of user if user role is note admin than send msg only admin can access
        const userId = req.user.id;

         const user = await User.findById(userId);
     
         if(!user || user.role !== 'admin'){
            console.log("only admin can access");
           return res.status(403).json({message:"only admin access this"});
          };
     
          const data = req.body;

          const newCandidate = new Candidate(data);

         //save candidate
         const response = await newCandidate.save();
         console.log("candidate data saved successfully");
         res.status(201).json({message:'candidate add successfully',response:response});
    }catch (error) {
        console.error(error);
        res.status(500).json(error,"Internal server error");
    }
});

//updates candidate data
router.put('/:id', jwtAuth, async (req,res)=>{
     try{
        //first check the role of user if user role is note admin than send msg only admin can access
        const userId = req.user.id;

         const user = await User.findById(userId);
     
         if(!user || user.role !== 'admin'){
            console.log("only admin can access");
           return res.status(403).json({message:"only admin access this"});
          };
     
          const updatedCandidateData = req.body;
          const candidateId = req.params.id;
          const response = await Candidate.findByIdAndUpdate(candidateId,updatedCandidateData,{
               new:true,//updated data
              runValidators:true,//all validation are reqiure
          });

          if(!response){
             return res.status(404).json({error:"candidate not found"})
          }

            console.log(" candidate data updated");
            res.status(200).json({message:'candidat data updated successfully',response:response});
    }catch (error) {
        console.error(error);
        res.status(500).json(error,"Internal server error");
    }
});

//delete any candidate data
router.delete('/:id', jwtAuth, async (req,res)=>{
     try{
        //first check the role of user if user role is note admin than send msg only admin can access
        const userId = req.user.id;

         const user = await User.findById(userId);
     
         if(!user || user.role !== 'admin'){
            console.log("only admin can access");
           return res.status(403).json({message:"only admin access this"});
          };
     
          
          const candidateId = req.params.id;
          const response = await Candidate.findByIdAndDelete(candidateId);

          if(!response){
             return res.status(404).json({error:"candidate not found"})
          }

            console.log("candidate deleted");
            res.status(200).json({message:'candidate deleted successfully',response:response});
    }catch (error) {
        console.error(error);
        res.status(500).json(error,"Internal server error");
    }
});

//fetch canidates data
router.get('/',async (req,res)=>{
  try{
         const data = await Candidate.find();
         console.log("data fetched");
  res.status(200).json(data);

  }catch(error){
      console.log(error);
      res.status(500).json(error,'Internal server error');
  }
});

//voter give vote to there selected candidate
router.post('/votes/:id', jwtAuth, async(req,res)=>{
    try {
        //
        const userId = req.user.id;
        const candidateId = req.params.id;

        const user = await User.findById(userId);
        const candidate = await Candidate.findById(candidateId);
        
        //if user not found
        if(!user) return res.status(404).json({message:'user not found'});
         
        //if user not found
        if(!candidate) return res.status(404).json({message:'canidate not found'});
        //if user role is admin then he not allow to give vote
         if(user.role !== 'voter'){
            console.log("only voter can give vote");
           return res.status(403).json({message:"only voter can give vote"});
          };

          
           if(user.isVoted){
            return res.status(403).json({message:"aleready voted"});
           }
          user.isVoted = true;
          await user.save();
          candidate.votes.push({
          user: new mongoose.Types.ObjectId(userId)
          });


          candidate.voteCount++;
          await candidate.save();

 
         console.log("user voted successfully there selected candidate");
         res.status(200).json({message:'user voted successfully'});

    } catch (error) {
        console.error(error);
        res.status(500).json(error,'Internal server error');
    }
});

//
router.get('/vote/counts', jwtAuth, async(req,res)=>{
        try{
          const userId = req.user.id;
          const user = await User.findById(userId);

          if(!user) return res.status(404).json({message:'user not found'});

          const candidatesData = await Candidate.find().sort({voteCount: -1});

          res.status(200).json({message:'list of candidates by highest value above',candidatesData:candidatesData});
        }catch(error){
            console.error(error);
            res.status(500).json(error,'Internal server error');
        }
})

export default router;