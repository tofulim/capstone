Kakao.init("e965922752dd0e459d202be15719070e");
function loginF(){
  Kakao.Auth.loginForm({
    success: function(authObj) {
      window.location = "/auth/kakao/callback";
    },
    fail: function(err) {
      alert(JSON.stringify(err));
    }
  });
}
