Kakao.init("e965922752dd0e459d202be15719070e");
function logout() {
  if(confirm("로그아웃을 하시겠습니까? ") == true){
    Kakao.Auth.logout(function(data){
      if(data == true){
        //var jlist=JSON.stringify(list);
        var xhr = new XMLHttpRequest();
        xhr.open("POST" , "/logout" , true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        var plist="";
        if(list._length!=0){
          var curr=list._head;
          var num=1;
          var rank;
          var count1;
          var index;
          while(curr){ // 특수문자가 &로 변환될 때 문제가 되므로 걸러줌
            index=-1;
            count1=0;
            if(curr.data.title.indexOf("&")>-1) {
              curr.data.title=encodeURIComponent(curr.data.title);
            }
            else if(curr.data.artist.indexOf("&")>-1) {
              curr.data.artist=encodeURIComponent(curr.data.artist);
            }
            index = rankArr.findIndex(i => i.vid == curr.data.VID);
            if(index>-1){
              console.log(rankArr[index].count);
              count1=rankArr[index].count;
            }
            plist+=`${num}=${curr.data.VID}/n/${curr.data.artist}/n/${curr.data.title}/n/${curr.data.thumbNail.default.url}/n/${curr.data.official_flag}/n/${count1}&`;
            curr=curr.next;
            num++;
          }
          xhr.send(plist);
        }
        alert("로그인 화면으로 이동합니다.");
        window.location = "/logout";
      } else {
        alert("fail");
        }
    });
  };
};

function friends() {
  Kakao.Auth.setAccessToken(Kakao.Auth.getAccessToken(), true)
    Kakao.API.request({
      url : '/v1/api/talk/friends',
      success : function(response){
        alert(response);
        console.log(response);
      },
      fail : function(error){
        alert(error);
        console.log(error);
      }
    });
}
