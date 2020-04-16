function friends() {
  Kakao.init("e965922752dd0e459d202be15719070e");
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
