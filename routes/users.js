var express = require('express');
var router = express.Router();
var db = require('./mysql');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { Board, User, Hashtag, Playlist, Follow } = require('../models');
const Op = Sequelize.Op;

/* GET users listing. */

router.get('/', function(req, res, next) {
  var board_number = [];
  var boardsonglist = [];
  var vidlist = [];
  User.findOne({ where : { id : req.user }, raw : true, })
  .then((user) => {
    Board.findAll({  // 현재 로그인한 사용자가 작성한 게시물들 갯수를 가져옴.
      raw : true,
      order : [['createdAt', 'DESC']],
      attributes : ['id', 'text', 'img', 'vid'],
      where : { userId : req.user },
    }).then((board) => {
      console.log('board : ', board);
      for(var i in board) {
        board_number[i] = board[i].id;
        vidlist.push(board[i].vid);
      }
      Playlist.findAll({  // 플레이리스트에서 위에서 불러온 게시물들의 vidlist인 노래들만 가져옴.
        raw : true,
        where : { vid : { [Op.in] : vidlist } }
      }).then((playlists) => {
        boardsonglist = playlists;
        console.log('boardsonglist : ', boardsonglist);
      });

      Hashtag.findAll({
        raw : true,
        attributes : ['id', 'text', 'boardId'],
        where : { boardId : { [Op.in] : board_number } },
      }).then((hashtag) => {
        res.render('capstone/mypage', {
          user : user,
          boards : board,
          hashtags : hashtag,
          boardsonglist : boardsonglist,
        });
      });
    });
  });
});

router.get('/secession', function(req, res, next) {
  User.findOne({
    raw : true,
    where : { id : req.user }
  }).then((result) => {
    res.render('capstone/secession', {
      user : result
    })
  })
});

router.post('/secession', function(req, res, next) {
  var board_number = [];
  var board_img = [];
  Board.findAll({
    raw : true,
    attributes : ['id', 'img'],
    where : { userId : req.user }
  }).then((board) => {
    console.log('board : ', board);
    for(var i in board) {
      board_number[i] = board[i].id;
      board_img[i] = board[i].img;
    }
    console.log('board_number : ', board_number);
    console.log('board_img : ', board_img);
    Hashtag.destroy({
      raw : true,
      where : { boardId : { [Op.in] : board_number } }
    }).then((hashtag) => {
      Playlist.destroy({
        raw : true,
        where : { id : req.user }
      }).then((playlist) => {
        Follow.destroy({
          raw : true,
          where : { [Op.or] : [ { er_id : req.user }, { ee_id : req.user } ]}
        }).then((follow) => {
          Board.destroy({
            raw : true,
            where : { userId : req.user }
          }).then((user) => {
            for(var j in board_img) {
              board_img[j] = board_img[j].substr(8);
              fs.unlinkSync("uploads/" + board_img[j]);
            }
            User.destroy({
              raw : true,
              where : { id : req.user }
            }).then((finish) => {
              req.session.destroy();
              res.redirect('/');
            })
          })
        })
      })
    })
  })
});

router.post('/', function(req, res, next) {
    User.update({
      nickname : req.body.changeName,
    }, { where : { id : req.user } }
  ).then((user) => {
    res.redirect('/main');
  })
});

router.get('/update/:id', function(req, res, next) {
  //id = 게시물 번호.
  let re = [];
  Hashtag.findAll({
    raw : true,
    where : { boardId : req.params.id },
    attributes : ['id', 'text', 'boardid'],
  }).then((hashtag) => {
    console.log('hashtag : ', hashtag);
    for(var i in hashtag) {
      re[i] = '#'.concat(hashtag[i].text);
    }
    re = re.join(' ');
    Board.findAll({
      where : { id : req.params.id },
      attributes : ['id', 'text'],
    }).then((board) => {
      res.render('capstone/updates', {
        id : req.params.id,
        board : board,
        re : re,
      });
    });
  });
});

router.put('/update_process/:id', async (req, res, next) => {
  var words = [];  // 새로 추가된 해시태그들

  Hashtag.findAll({
    where : { boardId : req.body.id },
    attributes : ['id', 'text'],
  }).then((hashtag) => {
    let tag = req.body.tags.match(/#[^\s]*/g);
    for(var i in tag) {
      words[i] = tag[i].slice(1);
    }
  });

  Hashtag.destroy({
    where : {
      boardId : req.body.id,
      text : { [Op.notIn] : words }
    },
  });

  try {
    var description = req.body.description;
    description = description.replace(/\r\n/gi, '<br>');
    const board = await Board.update({
      text : description,
    }, { where : { id : req.body.id } }
  ).then((board) => {

    for(var j in words) {
      Hashtag.findOrCreate({
        where : {
          boardId : req.body.id,
          text : words[j],
        },
      }).spread((hashtags, created) => {
        if (created) {
          Hashtag.findOne({
            order : [['id', 'DESC']],
            attributes : ['id'],
          }).then((result) => {
            db.query(`insert into boardhashtag(createdAt, updatedAt, boardId, hashtagId) values(NOW(), NOW(), ${req.body.id}, ${result.id}) on duplicate key update boardId = ${req.body.id}, hashtagId = ${result.id}`,
            function(error, result2) {
              if(error) throw error;
            })
          })
        }
      }) // spread끝
    } // for끝
  })
} catch(error) {
  console.log(error);
}
res.redirect('/main');
});

router.delete('/delete/:id', function(req, res, next) {
  var img_name = '';
  console.log('req.params.id : ', req.params.id);
  Board.findAll({
    raw : true,
    attributes : ['img'],
    where : { id : req.params.id },
  }).then((result) => {
    console.log('result : ', result);
    img_name = result[0].img;
    img_name = img_name.substr(8);
    fs.unlinkSync("uploads/" + img_name);
    Hashtag.destroy({
      raw : true,
      where : { boardId : req.params.id }
    }).then((result2) => {
      console.log('result2 : ', result2);
      Board.destroy({
        raw : true,
        where : { id : req.params.id }
      }).then((result3) => {
        res.redirect('/main');
      }).catch((error) => {
        console.log(error);
      });
    })
  })
});

module.exports = router;
