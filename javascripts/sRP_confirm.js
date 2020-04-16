function sRP_confirm(data){ //data 를 객체로 받아서 내가 필요한 것만 빼서 객체로 만들어 리턴함
  var compID;
  let mainArtist;
  var artist="";
  var title="";
  var artist2="";
  var t_confirm=["(Audio)","(Official Audio)","(Lyrics)","[Official Audio]","[Audio]","[AUDIO]","[MP3 Audio]", "Official Audio","(audio)","(MP3 Audio)","(official audio)"];
  var songInfo=[];
  for(var index in data){ //아티스트 찾아주기
    var tmp=data[index].snippet.title.split(" - ");
    var official_flag=0;
    artist2=tmp[0];
    compID=data[index].snippet.channelTitle;
    if(data[index].snippet.title.indexOf(compID)>-1 || artist2.indexOf(compID)>-1) { //채널 아이디랑 title에 [0]이랑 바로 같은 경우 --- 아티스트 추출 과정
      mainArtist=artist=compID; //아티스트 이름 찾아서 뽑기
      official_flag=1;
    }
    else if(compID.indexOf('VEVO')>-1){ //VEVO가 있는 공식채널이지만 스펠이 달라도 공식 아티스트로 인정해주는 과정
      compID=compID.split("VEVO")[0];
      if(artist2.trim().toUpperCase()==compID.toUpperCase()) { //title에 아티스트가 있는 경우
        mainArtist=artist=artist2;
        official_flag=1;
      }
    }
    else { // title에 아티스트가 채널명과 다르거나 다른사람이 올렸지만 아티스트 - 제목 으로 올렸을 경우
      artist=artist2;
    }

    for(var index3 in t_confirm){
      if(artist.indexOf(t_confirm[index3])>-1) {
        artist=artist.replace(t_confirm[index3],"");
      }
    }
    if(official_flag==1){
      songInfo.push({"artist":artist, "title":"","VID":data[index].id.videoId, "official_flag":"1"});
    }
    else {
    songInfo.push({"artist":artist, "title":"","VID":data[index].id.videoId,"official_flag":"0"}); //아티스트랑 vid먼저 넣어줌
    }
  }

  for(var index in data){ //제목 찾아주기
    var title2="";
    var tmp=data[index].snippet.title.includes(" - ") ? data[index].snippet.title.split(" - ") : data[index].snippet.title.split("-");
    if(tmp[1]!=undefined) {title2=tmp[1];}
    else {title2=tmp[0];}
    for(var index2 in t_confirm){ //audio 같은거 처리
      if(title2.indexOf(t_confirm[index2])>-1) {
        title2=title2.replace(t_confirm[index2],"");
      }
    }
    title=title2.trim();
    if(songInfo[index].artist=="" ||songInfo[index].artist.indexOf(title)>-1||(title.indexOf(mainArtist)>-1)&&mainArtist!=undefined) {songInfo[index].artist=mainArtist;} //아티스트가 안돼있으면 넣어줌
    songInfo[index].title=title;
    songInfo[index].thumbNail=data[index].snippet.thumbnails;
    if(songInfo[index].artist==undefined) songInfo[index].artist="";
  }
  return songInfo;

}
