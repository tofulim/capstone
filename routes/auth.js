const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { User } = require('../models');

router.get('/join', function(req, res, next) {
  res.render('capstone/join');
});

router.get('/findID', function(req, res, next) {
  res.render('capstone/findID');
});

router.post('/findID', function(req, res, next) {
  var sub_ID1 = "";
  var sub_ID2 = "";
  var result_ID = [];
  User.findAll({
    raw : true,
    attributes : ['realname', 'email'],
    where : { provider : 'local', realname : req.body.findIDName }
  }).then((result) => {
    console.log('result : ', result);
    for(var i in result){
      sub_ID1 = result[i].email.substr(0, 5);
      sub_ID2 = result[i].email.split('@')[0];
      for(var j=sub_ID1.length; j<sub_ID2.length; j++) {
        sub_ID1 += '*';
      }
      sub_ID1 = sub_ID1 + result[i].email.split('@')[1];
      result_ID[i] = sub_ID1;
    }
    console.log('result_ID : ', result_ID);
    res.render('capstone/IDView', {
      Local_ID : result_ID,
      name : req.body.findIDName,
    })
  })
});

router.get('/findPW', function(req, res, next) {
  res.render('capstone/findPW');
});

router.post('/findPW', function(req, res, next) {
  User.findAll({
    raw : true,
    attributes : ['email'],
    where : { realname : req.body.findPWName, email : req.body.findPWEmail, provider : 'local' }
  })
  .then((user) => {
    if(user == 0) {
      res.send('SSS 로컬에 가입하지 않은 계정입니다. 다시 확인해 주세요. ');
    }
    else {
      res.render('capstone/updatePW', {
        user : user[0].email,
      });
    }
  })
});

router.post('/updatePW', async(req, res, next) => {
  let hash = await bcrypt.hash(req.body.updatePW, 12);
  await User.update({
    password : hash,
  }, { where : { email : req.body.updatePWEmail } });
  return res.redirect('/');
});

router.post('/emailConfirm', function (req, res, next) {
  User.count({ raw : true, where : { email : req.body.value } }
  ).then((c) => {
    if (c > 0) {
      res.send('중복된 이메일입니다. 새로 입력 후 다시 중복확인을 해주세요.');
    }
    else res.send('사용 가능한 이메일입니다.');
  })
});

router.post('/join', async (req, res, next) => {
  var local_count = 0;
  try {
    let exUser = await User.findOne({ where : { email : req.body.joinEmail } });
    if (exUser) {
      return res.redirect('/auth/join');
    }
    let hash = await bcrypt.hash(req.body.joinPasswd, 12);
    await User.count({
      raw : true,
      where : { provider : 'local' },
    }).then((count) => {
      local_count = count+1;
      local_count = '9'.concat(local_count);
      console.log('local_count : ', local_count);
      User.create({
        id : local_count,
        realname : req.body.joinName,
        nickname : req.body.joinName,
        email : req.body.joinEmail,
        password : hash,
      });
    });
    return res.redirect('/');
  } catch (error) {
    console.log('error : ', error);
    return next(error);
  }
});

router.post('/localLogin', passport.authenticate("local", {
  successRedirect: '/main',
  failureRedirect: '/',
  })
);

router.get("/kakao", passport.authenticate("kakao-login"));

router.get("/kakao/callback", passport.authenticate("kakao-login", {
  successRedirect : "/main",
  failureRedirect : "/",
}), (req, res) => {
  res.redirect('/main');
});

module.exports = router;
