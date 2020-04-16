function init(lists,listnum){ //load playlist that user saved before
  console.log(lists);
  if(!!lists){
    var songInfo=[];
    for(var i=0;i<listnum;i++){
      var v=lists[i];
      songInfo.push({"artist":v.artist, "title":v.title,"VID":v.vid, "official_flag":v.official_flag,"thumbNail":{default : {url : v.thumbNail}}});
      list.append(songInfo[i]);
    }
    console.log(list);
    PLdisplay(list);
  }
}
