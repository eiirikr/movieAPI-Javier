const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const auth = require("../auth.js");

const { errorHandler } = auth;

// [SECTION] User Registration
module.exports.registerUser = (req, res) => {
  if (!req.body.email.includes("@")) {
    return res.status(400).send({
      error: "Email invalid",
    });
  } else if (req.body.password.length < 8) {
    return res.status(400).send({
      error: "Password must be atleast 8 characters",
    });
  } else {
    let newUser = new User({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    return newUser
      .save()
      .then((result) =>
        res.status(201).send({
          message: "Registered Successfully",
        })
      )
      .catch((error) => errorHandler(error, req, res));
  }
};

// [SECTION] User Login/Authentication
module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email format
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid Email" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "No email found" });
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Email and password do not match" });
    }

    // Generate access token
    const accessToken = auth.createAccessToken(user);

    // Send response
    return res.status(200).json({
      access: accessToken,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "An error occurred during login." });
  }
};
