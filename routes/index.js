const express = require('express');
const router = express.Router();
const db = require('./mysql');
const fs = require('fs');
const { Board, User, Hashtag, Playlist, Tos, Follow } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {KMR, KKMA} = require('koalanlp/API');
const {initialize} = require('koalanlp/Util');
const {Tagger, Parser} = require('koalanlp/proc');
initialize({packages: {KMR: '2.0.4', KKMA: '2.0.4'}, verbose: true});
var url = require('url');
var querystring = require('querystring');

router.get('/', function(req, res, next){

  res.render('capstone/firstPage');
});
router.get('/hiloo', function(req, res, next){ //블로그 xhr 테스트용
  console.log("hiloo로 들어왔음");
  var parsedUrl = url.parse(req.url); //url 부분만 뽑아옴
  console.log("parsedUrl : ",parsedUrl);
  // 5. 객체화된 url 중에 Query String 부분만 따로 객체화 후 출력
  var parsedQuery = querystring.parse(parsedUrl.query,'&','=');
  console.log("parsedQuery : ",parsedQuery);
  console.log(parsedQuery.name);
  res.render('capstone/hashtag', {
    boards : boards,
    hashtags : hashtags,
    boardsonglist : boardsonglist,
  });
  res.send("Hi Loo");
});

router.post('/usercheck', function(req, res, next){
  var user=req.user[0];
  console.log(user);
  res.send(user) ;
});

// router.post('/localF', function(req, res, next){
//   Follow.findAll({
//     raw : true,
//     where : {
//     er_id : req.user,
//     provider : local
//     }
//   })
//   res.send(user) ;
// });

router.post('/followcheck', function(req, res, next){ //팔로우/취소 버튼 유지를 위해 id 하나 갖고오면 비교하여 id or no를 리턴
  var user=req.body.id;
  console.log(user);
  Follow.findOne({
    raw : true,
    where : {
    er_id : req.user,
    ee_id : req.body.id
    }
  }).then((rest)=> {
    if(!!rest) res.send(rest.ee_id);
    else {
      res.send("no");
    }
  })
});

router.post('/findfriends', function(req, res, next){
  var user=req.user;
  console.log(user+"의 친구를 찾습니다.");
  Follow.findAll({
    raw : true,
    where : {
    er_id : user
    }
  }).then((rest)=> {
    console.log("Rest : ",rest);
    if(rest.length!=0){ //친구가 있을 때
      var flist=[];
      for(var i in rest){
        flist.push(rest[i].ee_id);
      }
      User.findAll({
        raw : true,
        where : { id : {[Op.in] : flist} }
      }).then((rest)=>{
        res.send(rest);
      });
    }
    else {
      console.log("no를 응답으로 전송했습니다");
      res.send("no");
    }
  });
});

router.post('/followbtn', function(req, res, next){
  console.log(req.body,"버튼 클릭했음!");
  if(Object.keys(req.body)=="follow"){ //팔로우하기
    Follow.create({
      er_id : req.user,
      ee_id : req.body.follow
    });
  }
  else{
    Follow.destroy({
      where : {
      er_id : req.user,
      ee_id : req.body.unfollow
    }
    });
  }
  res.send();
});

router.post('/friendclose', function(req, res, next){
  var ranking=null;
  Playlist.findAll({ raw : true,limit : 10, order: [['rank', 'DESC']] })
  .then((l)=> {
    ranking=l;
    console.log("ranking을 출력합니다---------------------------");
    console.log(ranking);
    res.send(ranking);
  });
});

router.post('/rankadd', function(req, res, next){
  Playlist.increment({ rank : 1 }, { where : { id : req.user, vid : req.body.vid }  //랭킹을 업데이트해줌
  });
  res.send();
});

router.post('/delete', function(req, res, next){ //버튼을 통해 눌렀을 때임
  Playlist.destroy({
    where : {
      id : req.user,
      vid : req.body.vid
    }
  });
  res.send();
});

router.post('/add', function(req, res, next){
  Playlist.create({
      id : req.user ,
      vid : req.body.song.VID ,
      artist : req.body.song.artist ,
      title: req.body.song.title,
      thumbNail : req.body.song.thumbNail.default.url ,
      official_flag : req.body.song.official_flag,
  })
  .catch(function(err){
    console.log(err);
  });
  res.send();
});

router.get('/localLogin', function(req, res, next){
  res.render('capstone/localLogin');
});

// router.post('/localLogin', function(req, res, next){
//  로컬로그인하면 여기를 통해서 회원정보 확인 후 맞으면 main으로
// });

router.get('/main', function(req, res, next) {
  var originalMaxAge = req.session.cookie.originalMaxAge;

  // function intervalFunc() {
  //   var now = new Date();
  //   if(now < originalMaxAge){  // 시간 비교가 안됌.
  //     console.log('////////////       false ////////////');
  //   }
  // }
  // var interval = setInterval(intervalFunc, 3000);
  req.session.touch();

  var board_number = [];
  var list = null;
  var ranking = null;
  var input=0;
  if(req._parsedUrl.query!=null) {
    input=req._parsedUrl.query.indexOf("refresh");
  }

  Playlist.findAndCountAll({ where : { id : req.user } })
  .then((l)=> {
    list=l;
  });

  Playlist.findAll({ raw : true, limit : 10, order: [['rank', 'DESC']] })
  .then((l)=> {
    ranking=l;
  });

  var followresult=[]; //사용자의 팔로워를 담는 배열
  var boardsonglist=[];

    Follow.findAll({
      raw : true,
      where : { er_id : req.user }
    }).then(result=>{
      console.log("result 값 : ",result); //없으면 []로 나옴
      followresult.push(req.user); // 사용자 것을 우선 넣음
      if(result.length!=0){
        for(var i in result){
          followresult.push(result[i].ee_id);
        }
        console.log("follow : ", followresult);
      }
      User.findAll({
        raw : true,
        attributes : ['nickname','id'],
        where : { id : { [Op.in] : followresult }}
      }).then((user) => {
        var usernick;
        for(var k in user){
          if(user[k].id==req.user) {
            usernick=user[k].nickname;
            break;
          }
        }
        console.log("user : ",user);
        Board.findAll({
          raw : true,
          order : [['createdAt', 'DESC']],
          where : { userId : { [Op.in] : followresult }}
        }).then((boards) => {
          var vidlist=[];
          for(var i in boards) {
            board_number[i] = boards[i].id;
            vidlist.push(boards[i].vid); //보드들의 vid를 모아 리스트로 만들어 pl 내에서 검색하기 위함
          }
          console.log(vidlist);
          Playlist.findAll({
            raw : true,
            where : { vid : { [Op.in] : vidlist } },
          }).then((boardpl)=>{
            boardsonglist=boardpl;
            console.log(boardpl);
          });
          Hashtag.findAll({
            raw : true,
            attributes : ['id', 'text', 'boardId'],
            where : { boardId : { [Op.in] : board_number } },
          }).then((hashtags) => {
              if(input > 0) {
                console.log('refresh!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                res.render('capstone/mainrefresh', {
                  usernick : usernick,
                  user : user,
                  boards : boards,
                  hashtags : hashtags,
                  ranking : ranking,
                  boardsonglist : boardsonglist
                });
                console.log('refresh!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
              }
              else {
                console.log('own main!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                res.render('capstone/main', {
                  usernick : usernick,
                  user : user,
                  boards : boards,
                  hashtags : hashtags,
                  list : list.rows,
                  listnum : list.count,
                  ranking : ranking,
                  boardsonglist : boardsonglist
                });
              }
          })
        })
      });
  })
});

router.post('/main', function(req, res, next){
  console.log("---------------------------------------------");
  console.log("작성한 게시물 형태소 변환하여 DB에 넣는 중 입니다");
  var input=req.body.input;
  var vid=req.body.vid;
  console.log(input);
  console.log(vid);
  let parser = new Parser(KKMA);
  let parsed = parser.analyzeSync(input);
  var list=new Set();
  for(const sent of parsed){
      for(const dep of sent.dependencies){
          list.add(dep.getDependent()._items[0]._surface+dep.getDependent()._items[0]._tag);
          console.log(dep.getDependent()._items[0]._surface+dep.getDependent()._items[0]._tag);
      }
  }
  Tos.findOne({ where : { vid : vid } }) //이 노래에 대한게 하나라도 있다?
  .then((tos) => {
    if(!!tos) { // 결과가 있을 때
      for( let item of list){
        Tos.findOrCreate({
          where : {
            vid : vid,
            tag : item,
          },
          defualt : {
            vid : vid,
            tag : item,
          }
        })
        .spread((tos1, created) => {
          if(!created){ //이미 있을 때
            console.log(`현재 중복인 아이템은 : ${item}입니다."`);
            Tos.increment({ count : 1 }, { where : { vid : vid, tag : item }  //랭킹을 업데이트해줌
            });
          }
          console.log(tos1.get({
            plain: true
          }));

        });
      }
    }
    else { //아예 그 노래에 대한 tos가 없을 때
      for(let item2 of list) {
        Tos.create({
          vid : vid,
          tag : item2,
        });
      }
    }
  });
  res.send();
});

router.post('/moodsearch', async function(req, res, next){
  var input=req.body.input;
  let parser = new Parser(KKMA);
  let parsed = parser.analyzeSync(input);
  var list=new Set();
  let score=new Map(); //vid & score 저장하는 맵
  var rankObj=[];
  for(const sent of parsed){
      for(const dep of sent.dependencies){
          list.add(dep.getDependent()._items[0]._surface+dep.getDependent()._items[0]._tag);
      }
  }
  for(let item of list){
    var result=await Tos.findAndCountAll({ where : { tag : item }
    },
    { limit : 5, order : [['count', 'DESC']]});
    console.log("---------------------");
    for(let i of result.rows){
      console.log(i.count); //해당 태그 가진 tos내 태그 count된 수
      if(score.has(i.vid)){ //이미 존재할 때, 추가해줌
        score.set(i.vid,(score.get(i.vid)+i.count));
        rankObj.find(e=>e.vid==i.vid).tag.push({t : i.tag, cnt : i.count});
      }
      else {
        score.set(i.vid,i.count);
        rankObj.push({vid : i.vid, tag : [{t : i.tag, cnt : i.count}]});
      }
    }
  }
  console.log("rankObj : ");
  console.log(rankObj);
  for(var i3 in rankObj){
    console.log(rankObj[i3].tag);
    rankObj[i3].tag.sort(function(a,b){
      return a.cnt > b.cnt ? -1 : a.cnt < b.cnt ? 1 : 0;
    });
  }
  for(var i3 in rankObj){
    console.log("간닷!!!!!!!!!!!!!!!!!!!");
    console.log(rankObj[i3].tag);
  }
  console.log(rankObj);

  console.log("score : ");
  console.log(score);
  const scored = new Map([...score.entries()].sort((a, b) => b[1] - a[1]));
  console.log("scored : ");
  console.log(scored);
  let i=1;
  var mslist=[];
  var mstaglist="";
  var tmp;
  for (let [key, value] of scored) {
    console.log(i+"번째 노래는 "+key + ' = ' + value);
    tmp=await Playlist.findOne({
      raw : true,
      where : {vid : key}
    });
    for(var idx3 in rankObj){
      if(rankObj[idx3].vid==key){
        for(var ii of rankObj[idx3].tag){
          mstaglist+=`${ii.t} `;
        }
        mstaglist+=`/n/`;
      }
    }
    mslist.push(tmp);
    i++;
  }
  console.log(mslist);
  console.log('////품사분석/////');
  res.render('capstone/moodsearch', {
    mslist : mslist,
    mstaglist : mstaglist,
  });
});

router.post('/search', function(req, res, next){
  res.render('capstone/searchResultPage');
});

router.post('/hashtag', function(req, res, next){
  var input = req.body.input;
  var board_number = [];
  var boardsonglist = [];
  var vidlist = [];

  Hashtag.findAll({
    raw : true,
    attributes : ['boardId'],
    where : { text : req.body.input },
  }).then((boardId) => {

    for(var i in boardId) {
      board_number[i] = boardId[i].boardId;
    }

    Board.findAll({
      raw : true,
      attributes : ['id', 'text', 'img', 'vid'],
      where : { id : { [Op.in] : board_number } },
    }).then((boards) => {
      for(var n in boards) {
        vidlist.push(boards[n].vid);
      }
      Playlist.findAll({
        raw : true,
        where : { vid : { [Op.in] : vidlist } }
      }).then((playlists) => {
        boardsonglist = playlists;
      });

      Hashtag.findAll({
        raw : true,
        attributes : ['text', 'boardId'],
        where : { boardId : { [Op.in] : board_number } },
      }).then((hashtags) => {
        console.log('boards : ', boards);
        console.log('hashtags : ', hashtags);
        res.render('capstone/hashtag', {
          boards : boards,
          hashtags : hashtags,
          boardsonglist : boardsonglist,
        });
      });
    });
  });
});

router.post('/usersearch', function(req, res, next) {
  var user_object = {};
  var user_id={};
  User.findAll({
    raw : true,
    attributes : ['nickname','id'],
    where : { [Op.or] : [{ nickname : req.body.input }, { realname : req.body.input }] }, // 검색한 게 실제 이름이거나 닉네임인 경우만 검색.
  }).then((user) => {
    for(var i in user) {
      user_object[i] = user[i].nickname;
      user_id[i]=user[i].id;
    }
    res.render('capstone/usersearch', {
      user : user_object, //닉네임이 들어감
      userId : user_id, //id가 들어감
    });
  })
});

router.post('/userpage', function(req, res, next){
  var id=req.body.id;
  User.findOne({
    where : {id : id}
  }).then((user)=>{

  });


});

router.get('/logout', function(req, res, next){

  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
