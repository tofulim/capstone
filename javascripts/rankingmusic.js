var rankArr = [];

function addRank(vid){
  var index = rankArr.findIndex(i => i.vid == vid);
  if(index>-1){
    rankArr[index].count+=1;
  }
  else {
    rankArr.push({"vid":vid, "count" : 1});
  }
}
