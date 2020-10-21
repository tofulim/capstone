function updateSubmit(id){
  window.opener.name = "updateParentPage";
  document.updatepopup.target = "updateParentPage";
  document.updatepopup.action = `/users/update_process/${id}?_method=PUT` ;
  document.updatepopup.submit();
  self.close();
}
