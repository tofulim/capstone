//검색결과를 객체와 변수로 searchREsultPage에 넘기고 페이지를 열게함
function enter(){
  if(window.event.keyCode == 13){
    onclickSearch();
  }
}

var userLorK;
$.post("/usercheck", function(data){
  console.log(data);
  userLorK=data;
});

var msArr = []; //moodsearch Arrr 둘데가 없어서 여따둠 걍
var optionParams;  //다음 페이지에 전달할 변수들
var searchDataSend;
function onclickSearch(){ //검색창에 입력한 값으로 2,3번에 새 html을 만들어 열어줌
  if(!!document.getElementById("inputText").value){ //뭐라도 적었을
    if(document.getElementById("sel_search").selectedIndex == 0) //artist & title search 일 때
    {
      history.pushState({data:"search"},null,"/search");
      var input = document.getElementById("inputText").value; //검색창에 입력한 값을 input으로 받아옴
      var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi;
      if(regExp.test(input)){
        var t = input.replace(regExp, `\\${regExp}`);
        input = t;
      }
      optionParams={
        q: `${input}+audio`,
        part:"snippet",
        key:key,
        type:"video",
        maxResults:10
      };
      var url="https://www.googleapis.com/youtube/v3/search?"; //유툽에 요청보낼 url
      for(var option in optionParams){
        url += option + "=" + optionParams[option] + "&";
      }
      url = url.substr(0, url.length-1);
      var searchResultHTML = "";
      var xhr = new XMLHttpRequest(); //유툽에 요청보낼 url통신을 위한 함수
      xhr.open("GET" , encodeURI(url) , true);
      xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200)
        {
          var searchData=JSON.parse(xhr.responseText).items;
          searchDataSend=searchData; //데이터 전달식
          $.ajax({
            url : '/search',
            type : 'post',
            success: function(data) {
              $('#SNS').html(data);  //searchResultPage에 있는 div, 여기에 쓸 것임
            },
            error: function() {
              console.log(error);
              $('#SNS').text('페이지 점검중 입니다.');
            }
          });
        }
      }
      xhr.send();
    }
    else if(document.getElementById("sel_search").selectedIndex == 2) { //hashtag search일 때

        history.pushState({data : "hashtag"}, null, "/hashtag");
        var input = document.getElementById("inputText").value;

        $.post("/hashtag", {input : input}, function(data){
          $('#SNS').html(data);
        });

    }
    else if(document.getElementById("sel_search").selectedIndex == 1) { //mood search 일 때
        history.pushState({data:"moodsearch"}, null, "/moodsearch");
        var input = document.getElementById("inputText").value;
        console.log(input + "이걸 입력했음");
        $.post("/moodsearch", {input : input}, function(data){
          $('#SNS').html(data);
        });
    }
    else if(document.getElementById("sel_search").selectedIndex == 3) { //user search 일 때
        history.pushState({data:"usersearch"}, null, "/usersearch");
        var input = document.getElementById("inputText").value;
        console.log(input + "이걸 입력했음");
        $.post("/usersearch", {input : input}, function(data){
          $('#SNS').html(data);
        });
    }
  }
}
