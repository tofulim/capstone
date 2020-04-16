function check() {
  theForm = document.popup;
  if (theForm.imgFile.value == "" || theForm.description.value == "" || theForm.tags.value == "") {
    if (theForm.imgFile.value == "") {
      alert("사진이 없습니다. 사진을 넣어주세요.")
      return false;
    }
    else if (theForm.description.value == "") {
      alert("내용이 없습니다. 내용을 입력해주세요.")
      return false;
    }
    else {
      alert("태그가 없습니다. 태그를 입력해주세요.");
      return false;
    }
  }
  else {
    Submit();
  }
}

function Submit(){
  window.opener.name = "parentPage";
  document.popup.target = "parentPage";
  document.popup.action = "/creates/board";
  document.popup.submit();
  self.close();
}
