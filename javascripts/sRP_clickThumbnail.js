function onclickImg(index){
  nowPlayingVID=confirmedData[index].VID;
  player.loadVideoById(confirmedData[index].VID);
  $.post("/rankadd", {vid : confirmedData[index].VID});
  PLdisplay(list);
  document.getElementById("btn-img").src = "/images/play.png"; a = 1;
  setTimeout(function(){
    document.getElementById("btn-img").src = "/images/pause.png"; a = 0;
  }, 100);
  player_songPrinter(confirmedData[index]);

}
function onclickPlaylist(vid){
  nowPlayingVID = vid;
  player.loadVideoById(vid);
  $.post("/rankadd", {vid : vid});
  document.getElementById("btn-img").src = "/images/play.png"; a = 1;
  setTimeout(function(){
    document.getElementById("btn-img").src = "/images/pause.png"; a = 0;
  }, 100);
  player_songPrinter(findNodebyVID(nowPlayingVID).data);
}
function onclickRanklist(vid,artist,title){
  player.loadVideoById(vid);
  document.getElementById("btn-img").src="/images/play.png"; a=1;
  setTimeout(function(){
    document.getElementById("btn-img").src="/images/pause.png"; a=0;
  },100);
  document.getElementById("nowPlayingSong").innerHTML=`현재 재생중인 음악 - ${artist} - ${title}`;
}
