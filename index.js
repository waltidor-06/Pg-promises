const bp = require("body-parser");
const express = require("express");
const app = express();
const port = 3000;

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

const Sequelize = require("sequelize");
const { User, Photo } = require("./models");

app.get("/users", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});
app.get("/users/by-last-name", async (req, res) => {
  const users = await User.findAll({
    attributes: ["lastName"],
  });
  res.json(users);
});
app.get("/users/photos", async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Photo,
      },
    ],
  });
  res.json(users);
});
app.get("/users/:id", async (req, res) => {
  try {
    const oneUser = await User.findByPk(req.params.id);
    res.json(oneUser);
  } catch (e) {
    console.log(e);
    res.status(404).json({
      message: "User not found",
    });
  }
  
});
app.post("/users", async (req, res) => {
  // req.body contains an Object with firstName, lastName, email
  const { firstName, lastName, email } = req.body;
  const newUser = await User.create({
    firstName,
    lastName,
    email,
  });

  // Send back the new user's ID in the response:
  res.json({
    id: newUser.id,
  });
});

app.post("/users/search", async (req, res) => {
  const users = await User.findAll({
    where: {
      [Sequelize.Op.or]: [
        {
          firstName: req.body.term,
          lastName: req.body.term,
        },
      ]
    },
    include: [{
      model: Photo
    }]
  });
  res.json(users);
});
app.post("/users/:id", async (req, res) => {
  const { id } = req.params;

  // Assuming that `req.body` is limited to
  // the keys firstName, lastName, and email
  const updatedUser = await User.update(req.body, {
    where: {
      id,
    },
  });

  res.json(updatedUser);
});
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const deletedUser = await User.destroy({
    where: {
      id,
    },
  });
  res.json(deletedUser);
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
