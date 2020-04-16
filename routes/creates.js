const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const db = require('./mysql');
const fs = require('fs');

const { Board, User, Hashtag } = require('../models');

fs.readdir('uploads', function(error) {
  if (error) {
    console.log('uploads 폴더가 없으므로 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
  }
})

const upload = multer({
  storage : multer.diskStorage({
    destination(req, file, cb){
      cb(null, 'uploads/');
    },
    filename : function(req, file, cb) {
      const ext = path.extname(file.originalname);  // 확장자(ex : .jpg)
      cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
    }
  }),
  limits : {filesize : 5 * 1024 * 1024}
})

router.get('/', function(req, res, next){
  res.render('capstone/creates');
});

router.post('/board', upload.single('imgFile'), async (req, res, next) => {
  try {
    const board = await Board.create({
      text : req.body.description,
      img : req.file.path,
      userId : req.user,
    });
    const hashtags = req.body.tags.match(/#[^\s]*/g);
    if (hashtags) {
      const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
        where : { text : tag.slice(1).toLowerCase() },
      })));
      await board.addHashtags(result.map(result2 => result2[0]));
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect('/main');
});

module.exports = router;
