var express = require('express');
var router = express.Router();
var db = require('./mysql');
const fs = require('fs');
const path = require('path');
const { Board, User, Hashtag } = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.findOne({ where : { id : req.user } })
  .then((user) => {
    Board.findAll({
      order : [['createdAt', 'DESC']],
    }).then((boards) => {
      res.render('capstone/mypage', {
        user : user,
        boards : boards,
      });
    })
  })
});

router.get('/update/:id', function(req, res, next) {
  Board.findAll({ where : { id : req.params.id } })
  .then((board) => {
    res.render('capstone/updates', {
      id : req.params.id,
      board : board,
    });
  });
});

router.put('/update_process/:id', function(req, res, next) {
  Board.update({
    text : req.body.description,
  }, { where : { id : req.body.id } })
  .then((result) => {
    res.redirect('/main');
  })
  .catch(error =>{
    console.log(error);
  });
});

router.delete('/delete/:id', function(req, res, next) {
  var img_name = '';
  img_name = db.query('select img from boards where id = ?', req.params.id, function(error, results){
    if(error){
      throw error;
    }
    img_name = results[0].img.substr(8);
    fs.unlinkSync("uploads/" + img_name);
  })
  Board.destroy({ where : { id : req.params.id } })
  .then(result => {
    res.redirect('/main');
  })
  .catch(error => {
    console.log(error);
  });
});

module.exports = router;
