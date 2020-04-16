function onclickImg(index){
  nowPlayingVID=confirmedData[index].VID;
  player.loadVideoById(confirmedData[index].VID);
  document.getElementById("btn-img").src="/images/play.png"; a=1;
  setTimeout(function(){
      document.getElementById("btn-img").src="/images/pause.png"; a=0;
  },100);

}
function onclickPlaylist(vid){
  console.log("addassda");
  nowPlayingVID=vid;
  player.loadVideoById(vid);
  document.getElementById("btn-img").src="/images/play.png"; a=1;
  setTimeout(function(){
      document.getElementById("btn-img").src="/images/pause.png"; a=0;
  },100);
}
