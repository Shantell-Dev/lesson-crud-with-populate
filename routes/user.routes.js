const router = require("express").Router();

const User = require("../models/User.model");

// ****************************************************************************************
// GET route to display the form to "register" a user
// ****************************************************************************************

router.get("/user-create", (req, res) => res.render("users/create"));

// ****************************************************************************************
// POST route to submit the form to create a user
// ****************************************************************************************

router.post("/user-create", (req, res) => {
  const { username } = req.body;
  User.findOne({ username })
    .then((userDocFromDB) => {
      if (!userDocFromDB) {
        User.create({ username })
        .then(() => res.redirect('/post-create'));
      } else {
        res.render("users/create", { message: "It seems you are already registered. ☀️" });
        return;
      }
    })
    .catch((err) => console.log(`Error while creating a new user: ${err}`));
});

// ****************************************************************************************
// GET route to display all users from the DB
// ****************************************************************************************

router.get("/users", (req, res) => {
  User.find() // <-- .find() method gives us always an ARRAY back
    .then((usersFromDB) => res.render("users/list", { users: usersFromDB }))
    .catch((err) => console.log(`Error while getting users from the DB: ${err}`));
});

// ****************************************************************************************
// GET details of a specific user (primarily their posts)
// ****************************************************************************************

router.get('/users/:userId/posts', (req, res, next) => {
  const { userId } = req.params;
 
  Post.findById(userId)
    .populate('author')
    .then(foundPost => res.render('user/details', foundPost))
    .catch(err => {
      console.log(`Err while getting a single post from the  DB: ${err}`);
      next(err);
    });
});

module.exports = router;
