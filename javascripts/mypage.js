function onclickMyPage(){
  history.pushState({data : "users"}, null, "/users");  // url을 users로 바꿈.
  $.ajax({
    url : '/users',
    type : 'get',
    success : function(data) {
      $('.SNS').html(data);
    },
    error : function() {
      $('.SNS').text('페이지 에러');
    }
  });
}
