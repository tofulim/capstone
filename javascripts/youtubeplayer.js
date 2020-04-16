// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
var player;
var a=1;
var nowPlayingVID;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '50',
    width: '50',
    videoId: 'pQV0WEdT_OE'
  });
}
function findNodebyVID(){
  var curr = list._head;
  while( curr.data.VID!=nowPlayingVID ) {
    curr = curr.next;
  }
  console.log(curr);
  return curr;
}
function onclickPP() {
  if(a==0) {player.pauseVideo();
    document.getElementById("btn-img").src="/images/play.png"; a=1;}
    else {player.playVideo();
      document.getElementById("btn-img").src="/images/pause.png"; a=0;}
}

function onclickPS() {
  var currNode=findNodebyVID();
  if(currNode.prev2.data.VID!=null){
    player.loadVideoById(currNode.prev2.data.VID);
    document.getElementById("btn-img").src="/images/play.png"; a=1;
    setTimeout(function(){
        document.getElementById("btn-img").src="/images/pause.png"; a=0;
    },100);
    nowPlayingVID= currNode.prev2.data.VID;
  }
  // player.loadPlaylist([currNode.data.VID,'dKnQcp9yjJI'],0,0);
}
function onclickNS() {
  var currNode=findNodebyVID();
  if(currNode.prev2.next.VID!=null){
    player.loadVideoById(currNode.next.data.VID);
    document.getElementById("btn-img").src="/images/play.png"; a=1;
    setTimeout(function(){
        document.getElementById("btn-img").src="/images/pause.png"; a=0;
    },100);
    nowPlayingVID= currNode.next.data.VID;
    // player.loadPlaylist([currNode.next.next.data.VID],0,0);
  }
}
