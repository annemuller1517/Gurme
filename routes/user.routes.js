const router = require('express').Router();
const User = require('../models/User.model');
// include CLOUDINARY:
const uploader = require('../config/cloudinary.config.js');

router.get('/profile', (req, res, next) => {
    // is user is not loggedin it will redirect to the signup page 
      if(!req.session.loggedInUser){
        res.redirect('/signup'); 
        return;
      }
      // When the login operation completes, user will be assigned to req.session.loggedInUser. This function is primarily used when users sign up, during which req.login() can be invoked to automatically log in the newly registered user.
      req.app.locals.isLoggedIn = true;
      let mainUser = req.session.loggedInUser

      if (mainUser === undefined) {
         mainUser = req.session.loggedInUser
      } 

    User.findOne({_id: mainUser._id})
    .populate("favorites")
    .then((user) => {
      res.render('auth/profile.hbs', {username: user.username, email: user.email, favorites: user.favorites, img: user.img});
    })
    .catch((err) => {
      next(err)
    })
})



router.post('/upload', uploader.single("imageUrl"), (req, res, next) => {
    if (!req.file) {
      res.redirect("/profile")
    }  
    let mainUser = req.session.loggedInUser

    User.updateOne({_id: mainUser._id}, {img: req.file.path})
    .then((user)=> {
        res.redirect("/profile")
    })
    .catch((err)=> {
        next(err)
    })
    if (!req.file) {
      next(new Error('No file uploaded!'));
      return;
    }
})


router.post("/recipe/:id/delete",(req, res, next) => {
    let {id} = req.params
    User.update({$pull: {favorites: { $in: id}}})
    .then(()=> {
        res.redirect("/profile")
    })
    .catch((err)=> {
        next(err)
    })
})






module.exports = router;
