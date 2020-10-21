function sRP_confirm(data){ //data 를 객체로 받아서 내가 필요한 것만 빼서 객체로 만들어 리턴함
  var compID;
  let mainArtist;
  var artist="";
  var title="";
  var artist2="";
  var t_confirm=["(Audio)","(Official Audio)","(Lyrics)","[Official Audio]","[Audio]","[AUDIO]","[MP3 Audio]", "Official Audio","(audio)","(MP3 Audio)","(official audio)", " - Topic"];
  var songInfo=[];
  for(var index in data){ //아티스트 찾아주기
    official_flag=0;
    var tmp=data[index].snippet.title;
    compID=data[index].snippet.channelTitle;
    if(tmp.indexOf(' - ')>-1){ // - 가 있을 때
      tmp=tmp.split(' - ');
      artist=tmp[0];
      title=tmp[1];
      if(compID.indexOf(artist)>-1 || compID.indexOf('VEVO')>-1 || artist.indexOf(compID)>-1) { //채널 아이디랑 title에 [0]이랑 바로 같은 경우 --- 아티스트 추출 과정
        official_flag=1;
        if(compID.indexOf('VEVO')>-1){ //VEVO가 있는 공식채널이지만 스펠이 달라도 공식 아티스트로 인정해주는 과정
          compID=compID.split('VEVO');
          if(tmp[0].trim().toUpperCase()==compID[0].toUpperCase()) { //title에 아티스트가 있는 경우
            artist=compID[0];
          }
        }
      }
    }
    else { //제목만 딸랑 올렸을 때 공식 음원이라고 추정
      if(compID.indexOf('VEVO')>-1){ //VEVO가 있는 공식채널이지만 스펠이 달라도 공식 아티스트로 인정해주는 과정
        compID=compID.split("VEVO")[0];
      }
      artist=compID;
      title=tmp;
      official_flag=1;
    }
    for(var index3 in t_confirm){
      if(artist.indexOf(t_confirm[index3])>-1) {
        artist=artist.replace(t_confirm[index3],"");
      }
      if(title.indexOf(t_confirm[index3])>-1) {
        title=title.replace(t_confirm[index3],"");
      }
      artist=artist.trim();
      title=title.trim();
    }
    if(official_flag==1){
      songInfo.push({"artist":artist, "title": title,"VID":data[index].id.videoId, "official_flag":"1", "thumbNail":data[index].snippet.thumbnails});
    }
    else {
    songInfo.push({"artist":artist, "title":title,"VID":data[index].id.videoId,"official_flag":"0",
    "thumbNail":data[index].snippet.thumbnails}); //아티스트랑 vid먼저 넣어줌
    }
  }
  return songInfo;
}
