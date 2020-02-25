    // This function creates an <iframe> (and YouTube player)
    // after the API code downloads.
var player;
var a=1;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '50',
        width: '50',
        videoId: 'pQV0WEdT_OE'
    });
}
function onclickPP() {
  if(a==0) {player.pauseVideo();
    document.getElementById("btn-img").src="img/play.png"; a=1;}
  else {player.playVideo();
    document.getElementById("btn-img").src="img/pause.png"; a=0;}
}
function onclickConfirmId(){
    var input = document.getElementById("changeBtn").value;
      player.loadVideoById(input);


}
