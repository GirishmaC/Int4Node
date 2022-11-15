const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const { users } = require("../db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
//signup
router.post(
  "/signup",
  [
    check("email", "Enter Valid Email").isEmail(),
    check(
      "password"
    ).isLength({
      min: 4,
    }),
  ],
  async (req, res) => {
    const { email, password } = req.body;
    const error = validationResult(req);
     if (!error.isEmpty()) {
      return res.status(400).json({
        error: error.array(),
      });
    }
   let user = users.find((user) => {
      return user.email === email;
    });

    if (user) {
      return res.status(400).json({
        error: [
          {
            msg: "User Exists",
          },
        ],
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({
      email,
      password: hashedPassword,
    });
    const token = await JWT.sign(
      {
        email,
      },
      
      {
        expiresIn: 3600000,
      }
    );

    res.json({
      token,
    });
  }
);
/////Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = users.find((user) => {
    return user.email === email;
  });

  if (!user) {
    return res.status(422).json({
      errors: [
        {
          msg: "Credentials Invalid",
        },
      ],
    });
  }

  let isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(404).json({
      errors: [
        {
          msg: "Credentials Invalid",
        },
      ],
    });
  }
  const token = await JWT.sign(
    {
      email,
    },
    {
      expiresIn: 3600000,
    }
  );

  res.json({
    token,
  });
});

router.get("/all", (req, res) => {
  res.json(users);
});

module.exports = router;