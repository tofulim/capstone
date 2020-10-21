function check() {
  theForm = document.popup;
  if (theForm.imgFile.value == "" || theForm.description.value == "" || theForm.tags.value == "" || theForm.selectSong.value == "none") {
    if (theForm.imgFile.value == "") {
      alert("사진이 없습니다. 사진을 넣어주세요.")
      return false;
    }
    else if (theForm.description.value == "") {
      alert("내용이 없습니다. 내용을 입력해주세요.")
      return false;
    }
    else if (theForm.tags.value == "") {
      alert("태그가 없습니다. 태그를 입력해주세요.");
      return false;
    }
    else if (theForm.selectSong.value == "none") {
      alert("게시물에 등록할 노래를 선택해주세요.");
      return false;
    }
  }
  else {
    console.log(theForm.description.value + "이걸 입력했음");
    Submit();
    window.opener.popup2(theForm.description.value,theForm.tags.value, theForm.selectSong.value);
  }
}

function Submit() {
  window.opener.name = "parentPage";
  document.popup.target = "parentPage";
  document.popup.action = "/creates/board";
  document.popup.submit();
  self.close();
}

function emailConfirm(value) {
  $.post("/auth/emailConfirm", {value : value}, function(data) {
    alert(data)
    console.log('data : ', data);
    if(data == "중복된 이메일입니다. 새로 입력 후 다시 중복확인을 해주세요.") {
      console.log('hello');
      $('#joinEmail').attr("check_result", "fail");
    }
    else {
      $('#joinEmail').attr("check_result", "success");
    }
  });
}

function localCheck() {
  theForm = document.loginPopup;
  if (theForm.localEmail.value == "" || theForm.localPasswd.value == "") {
    if (theForm.localEmail.value == "") {
      alert("이메일을 작성해주세요. ")
      return false;
    }
    else if (theForm.localPasswd.value == "") {
      alert("비밀번호를 작성해주세요. ")
      return false;
    }
  }
  else {
    localSubmit();
  }
}

function localSubmit() {
  window.opener.name = "parentPage";
  document.loginPopup.target = "parentPage";
  document.loginPopup.action = "/auth/localLogin";
  document.loginPopup.submit();
  self.close();
}

function joinCheck() {
  theForm = document.joinForm;
  if (theForm.joinName.value == "" || theForm.joinEmail.value == "" || theForm.joinPasswd.value == "" || theForm.joinPasswdConfirm.value == "" || theForm.joinPasswd.value != theForm.joinPasswdConfirm.value || ($('#joinEmail').attr("check_result") == "fail")) {
    if (theForm.joinName.value == "") {
      alert("이름을 작성해주세요. ")
      return false;
    }
    else if (theForm.joinEmail.value == "") {
      alert("이메일을 작성해주세요. ")
      return false;
    }
    else if (theForm.joinPasswd.value == "") {
      alert("비밀번호를 작성해주세요. ")
      return false;
    }
    else if (theForm.joinPasswdConfirm.value == "") {
      alert("비밀번호 확인 칸을 채워주세요. ")
      return false;
    }
    else if (theForm.joinPasswd.value != theForm.joinPasswdConfirm.value) {
      alert("비밀번호와 비밀번호 확인이 서로 다릅니다.")
      return false;
    }
    else if ($('#joinEmail').attr("check_result") == "fail") {
      alert("이메일 중복확인을 해주시기 바랍니다.");
      $('#joinEmail').focus();
      return false;
    }
  }
  else {
    joinSubmit();
  }
}

function joinSubmit() {
  window.opener.name = "parentPage";
  document.joinForm.target = "parentPage";
  document.joinForm.action = "/auth/join";
  document.joinForm.submit();
  self.close();
}

function updatePWCheck() {
  theForm = document.updatePWForm;
  if (theForm.updatePW.value == "" || theForm.updatePWConfirm.value == "" || theForm.updatePW.value != theForm.updatePWConfirm.value ) {
    if (theForm.updatePW.value != theForm.updatePWConfirm.value) {
      alert("비밀번호와 비밀번호 확인이 서로 다릅니다.")
      return false;
    }
  }
  else {
    updatePWSubmit();
  }
}

function updatePWSubmit() {
  window.opener.name = "parentPage";
  document.updatePWForm.target = "parentPage";
  document.updatePWForm.action = "/auth/updatePW";
  document.updatePWForm.submit();
  self.close();
}
