import express from 'express';
import bcrypt from "bcrypt";
import User from '../models/user.js';
import jwt from "jsonwebtoken";

const router = express.Router();


//user signup router
router.post('/signup', async(req,res)=>{
   try{
          const data = req.body;
          // hash password
          data.password = await bcrypt.hash(data.password, 10);

          const newUser = new User(data);

          const response = await newUser.save();
          console.log("data saved");
          res.status(200).json({response:response});

   }catch(error){
         console.error(error);
         res.status(500).json(error,"Internal Server error");
   }
});



// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { aadharCard, password } = req.body;

    const user = await User.findOne({ aadharCard });
    if (!user) {
      return res.status(401).json({ message: "Invalid Aadhar number" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token: token
    });

  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
});


//fetch voter(user) data
router.get('/',async (req,res)=>{
  try{
         const data = await User.find();
         console.log("data fetched");
  res.status(200).json(data);

  }catch(error){
      console.log(error);
      res.status(500).json(error,'Internal server error');
  }
});

export default router;