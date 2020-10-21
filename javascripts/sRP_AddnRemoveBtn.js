function onclickAddBtn(index){
  if(list.indexOf(confirmedData[index].VID)==-1){
    list.append(confirmedData[index]);
    // $.post("/add", {song : confirmedData[index]});
    $.ajax({
      type: "POST",
      url: "/add",
      data : {song : confirmedData[index]},
      async:false,
      success: function(data){
      }
    });
    PLdisplay(list);
  }
  else {
    alert("이미 내 플레이리스트에 있는 노래입니다 !");
  }
}
function onclickRankAddBtn(i,type){ //랭킹에 있는 노래를 추가
  var songInfo=[];
  var rlist;
  if(type=="2") { //mooodsearch 일 때
    rlist=msArr[i];
  }
  else { //type이 rk일때
    rlist=ranking[i];
  }
  if(list.indexOf(rlist.vid)==-1){
    songInfo.push({"artist":rlist.artist, "title":rlist.title,"VID":rlist.vid, "official_flag":rlist.official_flag,"thumbNail":{default : {url : rlist.thumbNail}}});
    list.append(songInfo[0]);
    $.post("/add", {song : songInfo[0]});
    PLdisplay(list);
  }
  else {
    alert("이미 내 플레이리스트에 있는 노래입니다 !");
  }
}
function onclickRemoveBtn(vid){
  $.post("/delete", {vid : vid});
  list.remove(vid);
  PLdisplay(list);
}
