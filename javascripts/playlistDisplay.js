function PLdisplay(list2){
  list=list2;
  var curr;
  var num;
  var printPL="";
  if(list2._head != null)
   {
    curr = list2._head;
    while( curr ) {
      if(curr.data.title.indexOf('&amp;#39;')>-1){
        curr.data.title=curr.data.title.replace('&amp;#39;','\'');
      }
      printPL+=`<div class="songlist" onclick="onclickPlaylist(\'${curr.data.VID}\')"><img src="${curr.data.thumbNail.default.url}" style="width:50px; height:55px; float:left;" > <span style="display:block;">${curr.data.artist}</span><span style="display:block;">${curr.data.title}</span><div onclick="event.cancelBubble=true;"><button type="button" onclick="onclickRemoveBtn(\'${curr.data.VID}\');">삭제</button></div></div>`;
      curr = curr.next; //event.cancelBUbble=true 는 onclick 내에 onclick 있을 때 해결법임
    }
    document.getElementById("Playlist").innerHTML=printPL;
  }
  else {
    document.getElementById("Playlist").innerHTML=printPL;
  }
}
