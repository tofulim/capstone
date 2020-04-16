const express = require('express');
const router = express.Router();
const passport = require('passport');
const { User } = require('../models');


router.get("/kakao", passport.authenticate("kakao-login"));

router.get("/kakao/callback", passport.authenticate("kakao-login", {
  successRedirect : "/main",
  failureRedirect : "/",
}), (req, res) => {
  res.redirect('/main');
});

module.exports = router;
