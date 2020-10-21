function popup2(description,tags,vid){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/main", true);
  xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  var confirmedtag=tags.replace(/\#/gi, '');
  xhr.send(`input=${description} ${confirmedtag}&vid=${vid}`);
}
