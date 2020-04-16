function onclickAddBtn(index){
  list.append(confirmedData[index]);
  PLdisplay(list);
}

function onclickRemoveBtn(vid){
  list.remove(vid);
  PLdisplay(list);
}
