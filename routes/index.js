const express = require('express');
const router = express.Router();
const db = require('./mysql');
const { Hashtag,Board, User, Playlist } = require('../models');
const {KMR, KKMA} = require('koalanlp/API');
const {initialize} = require('koalanlp/Util');
const {Tagger, Parser} = require('koalanlp/proc');
initialize({packages: {KMR: '2.0.4', KKMA: '2.0.4'}, verbose: true});

router.get('/', function(req, res, next){
  res.render('capstone/firstPage');
});

router.get('/main', function(req, res, next){

  var user_number = req.user;
  var list=null;
  Playlist.findAndCountAll({ where : { id : user_number } })
  .then((l)=> {
    list=l;
    console.log(list.rows[1].dataValues);
  });
  User.findOne({ where : { id : user_number } })
  .then((user) => {
    Board.findAll({ //여기 아래에 Playlist도 추가해줘야함
      order : [['createdAt', 'DESC']],
    }).then((boards) => {
      console.log('boards : ', boards);
      res.render('capstone/main', {
        user : user,
        boards : boards,
        list : list.rows,
        listnum : list.count,
      });
    })
  });

});

router.post('/moodsearch', function(req, res, next){
  var input=req.body.input;
  let tagger = new Tagger(KMR);
  let tagged = tagger.tagSync(input);
  for(const sent of tagged) {
      console.log(sent.toString());
  }

  let parser = new Parser(KKMA);
  let parsed = parser.analyzeSync(input);
  for(const sent of parsed){
      console.log(sent.toString());
      for(const dep of sent.dependencies){
          console.log(dep.toString());
      }
  }
  console.log('////품사분석/////');
});
router.post('/search', function(req, res, next){
  res.render('capstone/searchResultPage');
  console.log('////////////');
});
router.post('/logout', function(req, res, next){
  var playList=req.body;
  for(var index in playList){
    var pl=playList[index].split("/n/");
    Playlist.findOrCreate({ //vid로 db 찾아서 없으면 추가함 근데 아직 삭제는 안했음
      where : { id : req.user,
      vid : pl[0]
    },
      defaults : { id : req.user ,
        vid : pl[0] ,
        artist : pl[1] ,
        title: pl[2],
        thumbNail : pl[3] ,
        official_flag : pl[4]
     }});
  }
});

router.get('/logout', function(req, res, next){
  req.session.destroy();
  res.redirect('/');
});



module.exports = router;
