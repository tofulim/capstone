function onclickSearch(){ //검색창에 입력한 값
  var input = document.getElementById("inputText").value; //검색창에 입력한 값을 input으로 받아옴
  var ss=document.getElementById("searchResultPage");
  ss.innerHTML = "<tr><th>Name</th><th>Type</th><th>Value</th></tr>";
}
