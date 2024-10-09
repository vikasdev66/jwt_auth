require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());

const users = [
  {
    username: "vikas",
    title: "post1",
  },
  {
    username: "raj",
    title: "post2",
  },
];

app.get("/users", authenticationToken, (req, res) => {
  res.json(users.filter((user) => user.username === req.user.name));
});

app.post("/users", async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    console.log("hashPassword", hashPassword);
    const user = { name: req.body.name, password: hashPassword };
    users.push(user);
    res.status(201).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// app.post("/users/login", async (req, res) => {
//   const user = users.find((user) => user.name === req.body.name);
//   if (user.name === null) {
//     return res.status(400).send("user not found");
//   }
//   try {
//     if (await bcrypt.compare(req.body.password, user.password)) {
//       res.send("Success");
//     } else {
//       res.send("This incorrect user and password");
//     }
//   } catch {
//     res.status(500).send();
//   }
// });

function authenticationToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(5000, () => {
  console.log("Port: 5000, Server is running......");
});
