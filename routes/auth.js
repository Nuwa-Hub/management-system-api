const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//REGISTER
router.post("/register", async (req, res) => {

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    isAdmin:req.body.isAdmin,
    ismainAdmin:req.body.ismainAdmin,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
    address: req.body.address,
    telNo: req.body.telNo,
    birthday:req.body.birthday,
    img:req.body.img,
    fullname:req.body.fullname,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("Wrong credentials!");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    OriginalPassword !== req.body.password &&
      res.status(401).json("Wrong credentials!");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "2d" }
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });

  } catch (err) {}
});

//CHNAGE PASSWORD
router.post("/changepassword",verifyTokenAndAdmin, async (req, res) => {
  try {
    
    const user = await User.findOne({ _id: req.body.userId });
    !user && res.status(401).json("Wrong credentials!");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    
    OriginalPassword !== req.body.currentPassword &&
      res.status(401).json("Your Password is Wrong!");
    if (OriginalPassword === req.body.currentPassword) {
      const updatePassword = await User.findByIdAndUpdate(
        req.body.userId,
        {
          $set: {
            password: CryptoJS.AES.encrypt(
              req.body.newPassword,
              process.env.PASS_SEC
            ).toString(),
          },
        },
        { new: true }
      );
    }
    res.status(200).json("Password Update Success!");
  } catch (err) {}
});
module.exports = router;
