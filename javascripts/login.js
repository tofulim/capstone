function loginF(){
  Kakao.init("e965922752dd0e459d202be15719070e");
  Kakao.Auth.loginForm({
    scope : 'friends',
    success: function(authObj) {
      window.location = "/auth/kakao/callback";
    },
    fail: function(err) {
      alert(JSON.stringify(err));
    }
  });
}
