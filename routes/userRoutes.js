import express from 'express';
import bcrypt from "bcrypt";
import User from '../models/user.js';
import jwt from "jsonwebtoken";
import jwtAuth from '../middleware/jwtAuth.js';

const router = express.Router();


//user signup router
// user signup router
router.post('/signup', async (req, res) => {
  try {
    const data = req.body;

    // hash password
    data.password = await bcrypt.hash(data.password, 10);

    const newUser = new User(data);

    // save user
    const response = await newUser.save();
    console.log("data saved");

    // create JWT token using saved user data
    const token = jwt.sign(
      {
        id: response._id,
        role: response.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      response:response,
      token: token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
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
    if (isMatch) {
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

// Profile route
router.get('/profile', jwtAuth, async (req, res) => {
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({user});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//password change route
router.put('/profile/password',jwtAuth,async (req,res)=>{
        try {
          //extract the user id
          const userId = req.user.id;
          const {currentPassword, newPassword} = req.body;

          //check the current and new password present in the req body
          if(!currentPassword || !newPassword){
               res.status(404).json({error:"both password is require"});
          }
          //find user id
          const user = await User.findById(userId);

            //if user not exist or password is not match
            // If user does not exist or password does not match, return error
           if (!user || !(await user.comparePassword(currentPassword))) {
               return res.status(401).json({ error: 'Invalid current password' });
           }

           //updated the user password
           user.password = newPassword;
           await user.save();

           //
            console.log('password updated');
            res.status(200).json({ message: 'Password updated' });

        } catch (error) {
            console.error(error);
            res.status(500).json(error,'Internal server error');
        }
});

export default router;