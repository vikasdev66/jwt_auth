require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());

// app.post("/users", async (req, res) => {
//   try {
//     const hashPassword = await bcrypt.hash(req.body.password, 10);
//     console.log("hashPassword", hashPassword);
//     const user = { name: req.body.name, password: hashPassword };
//     users.push(user);
//     res.status(201).send();
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

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

let refreshTokens = [];

app.post("/users/token", (req, res) => {
  const refreshToken = req.body.token;
  console.log({
    refreshTokens,
    refreshToken,
    yes: refreshTokens.includes(refreshToken),
    REFRESh_TOKEN_SECRET: process.env.REFRESh_TOKEN_SECRET,
  });
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESh_TOKEN_SECRET, (error, user) => {
    if (error) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken });
  });
});

app.delete("/users/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.post("/users/login", (req, res) => {
  try {
    const username = req.body.username;
    const user = { name: username };
    const refreshToken = jwt.sign(user, process.env.REFRESh_TOKEN_SECRET);
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// function authenticationToken(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader?.startsWith("Bearer ")
//     ? authHeader.split(" ")[1]
//     : null;

//   console.log({ authHeader, token });
//   if (token == null) return res.sendStatus(401);
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "25s" });
}

app.listen(3000, () => {
  console.log("Port: 3000, Server is running......");
});
