function logout() {
  Kakao.init("e965922752dd0e459d202be15719070e");
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
          while(curr){ // 특수문자가 &로 변환될 때 문제가 되므로 걸러줌 
            if(curr.data.title. indexOf("&")>-1) {
              curr.data.title=encodeURIComponent(curr.data.title);
            }
            else if(curr.data.artist.indexOf("&")>-1) {
              curr.data.artist=encodeURIComponent(curr.data.artist);
            }
            plist+=`${num}=${curr.data.VID}/n/${curr.data.artist}/n/${curr.data.title}/n/${curr.data.thumbNail.default.url}/n/${curr.data.official_flag}&`;
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
