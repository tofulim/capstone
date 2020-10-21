Kakao.init("e965922752dd0e459d202be15719070e");
function logout() {
  if(confirm("로그아웃을 하시겠습니까? ") == true){
    Kakao.Auth.logout(function(data){
      if(data == true){
        alert("로그인 화면으로 이동합니다.");
        window.location = "/logout";
      } else {
        alert("fail");
      }
    });
  };
};

let friendflagChecker=true;
function friends() {
  if(friendflagChecker){ //처음 눌렀을 때 true, ranking에 창 열기
    var msg="";
    var printF=`<h1>F r i e n d s</h1>`;
    if(userLorK!='9'){ //카카오 로그인했을 경우
      console.log("카카오 로그인!!!!!!!!!!!!!!!!!!!!!!!!");
      Kakao.Auth.setAccessToken(Kakao.Auth.getAccessToken(), true)
      Kakao.API.request({
        url : '/v1/api/talk/friends',
        success : function(data){ //카카오친구들, 이제 로컬친구들을찾아서 더해줘야함
          var friend=data.elements;
          $.ajax({
            type: "POST",
            url: "/findfriends",
            async:false,
            success: function(data2){
              if(data2!="no"){
                for(var i in data2){
                  if(data2[i].id[0]=='9'){
                    friend.push(data2[i]);
                  }
                }
              }
              console.log("친구 합본 출력");
              console.log(friend);
            }
          });
          if(!!friend){ ///// 로컬 유저랑 친구 맺은 것도 추가해 줘야 함...
            for(let i in friend){
              var fr=friend[i];
              $.ajax({
                type: "POST",
                url: "/followcheck",
                data: {id : fr.id},
                async:false,
                success: function(data3){
                  if(data3!="no") msg="팔로우 취소";
                  else msg="팔로우";
                }
              });
              var pic;
              var nick;
              if(fr.id[0]=='9'){ //로컬친구
                if(i%3==0) pic="/images/pig.png";
                else if(i%3==1) pic="/images/dog.png";
                else if(i%3==2) pic="/images/rat.png";
                nick=fr.nickname;
              }
              else { //카카오
                if(fr.profile_thumbnail_image.indexOf("http")>-1) pic=fr.profile_thumbnail_image;
                else {
                  if(i%3==0) pic="/images/pig.png";
                  else if(i%3==1) pic="/images/dog.png";
                  else if(i%3==2) pic="/images/rat.png";
                }

                nick=fr.profile_nickname;
              }

              printF+=`<div class="frlist" style="background-color:#eceff6; height:60px;"><img src="${pic}" style="border-radius:8px; width:60px; height:60px; float:left;" > <span style="display:block;">${nick}</span><div onclick="event.cancelBubble=true;"><button id="${fr.id}"onclick="onclickfollowBtn(${fr.id})" name="uf">${msg}</button></div></div>`;
            }
            document.getElementById("Ranking").innerHTML=printF;
          }
          else{ //친구가 없음!
            alert("User 검색에서 새 친구를 찾아 보세요!");
          }

        },
        fail : function(error){
          alert(error);
          console.log(error);
        }
      });
      friendflagChecker=false; //false 로 만들어 다음에 누르면 친구창 닫고 랭킹 출력하게함

    }
    else if(userLorK=='9'){ //로컬 유저일 경우
      var fr;
      $.ajax({
        type: "POST",
        url: "/findfriends",
        async:false,
        success: function(data){
          if(data!="no") {
            for(var i in data){ //친구정보 하나하나렌더
              fr=data[i];
              var pic;
              if(i%3==0) pic="/images/pig.png";
              else if(i%3==1) pic="/images/dog.png";
              else if(i%3==2) pic="/images/rat.png";
              printF+=`<div class="frlist" style="background-color:#eceff6; height:60px;"><img src="${pic}" style="border-radius:8px; width:60px; height:60px; float:left;" > <span style="display:block;">${fr.nickname}</span><div onclick="event.cancelBubble=true;"><button id="${fr.id}"onclick="onclickfollowBtn(${fr.id})" name="uf">팔로우 취소</button></div></div>`;
            }
            document.getElementById("Ranking").innerHTML=printF;
          }
          else alert("새 친구들을 찾아 보세요!");
        }
      });
    }
  }
  else { // 창을 닫아야 함
    $.post("/friendclose", function(ranking){
      if(!!ranking){
        var printRK=`<h1>R a n k i n g</h1>`;
        for(var i in ranking){
          var song=ranking[i];
          if(song.title.indexOf('&amp;#39;')>-1){
            song.title=song.title.replace('&amp;#39;','\'');
          }
          printRK+=`<div class="ranklist" style="background-color:#eceff6; height:60px;" onclick="onclickRanklist(\'${song.vid}\')"><img src="${song.thumbNail}" style="border-radius:8px; width:60px; height:60px; float:left;" > <span style="display:block;">${song.artist}</span><span style="display:block;">${song.title}</span><div onclick="event.cancelBubble=true;"><button onclick="onclickRankAddBtn(${i},1)">담기</button></div></div>`;
        }
        document.getElementById("Ranking").innerHTML=printRK;
      }
    });
    friendflagChecker=true;
  }
}

function onclickfollowBtn(id){
  console.log("id : ",id);
  var tag=document.getElementById(id);
  console.log(tag);
  if(tag.name=="uf") { //언팔이고, 눌렀을 때 -> 팔로우하게
    $.post("/followbtn", {follow : id});
    tag.name="f";
    tag.innerHTML="팔로우 취소";
  }
  else{
    $.post("/followbtn", {unfollow : id});
    tag.name="uf";
    tag.innerHTML="팔로우";
  }
}
