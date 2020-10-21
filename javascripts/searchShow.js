function show_word() {
  var words = document.getElementById("inputText").value;
  document.getElementById("showWord").innerHTML = `<h2 style="text-align: center;">'${words}' 의 검색 결과  <h2>`;
}
