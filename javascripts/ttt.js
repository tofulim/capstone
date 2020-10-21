function test(){

  var xhr = new XMLHttpRequest();   // (1) 객체 생성
  var data = {
  name: 'zerocho',
  birth: 1994,
  };
  var data="hihiloo";

  xhr.open('POST','/hiloo'); //﻿(2) 서버와의 처리 방법을 등록
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); //﻿(4) 필요시, 요청 헤더를 설정
  xhr.onreadystatechange = function() { //﻿(3) 응답시, 이에 대한 반응 및 처리해야할 작업(이벤트핸들러 등 )을 작성함
      if (xhr.readyState === 4) {   // (수신 완료, XMLHttpRequest.DONE : 4)
          if (xhr.status === 200) { // (통신 성공)
              console.log(xhr.responseText);
          } else {
              console.log('서버 에러 발생');
          }
      } else { // 통신 완료 전
          console.log('통신중...');
      }
  }
  xhr.send(JSON.stringify(data)); //﻿(5) 요청을 전송하고 통신을 시작
}
function test(){

  var xhr = new XMLHttpRequest();   // (1) 객체 생성
  // var data = {
  // name: 'zerocho',
  // birth: 1994,
  // };
  var data="hihiloo";

  xhr.open('GET','/hiloo?name=dh'); //﻿(2) 서버와의 처리 방법을 등록
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); //﻿(4) 필요시, 요청 헤더를 설정
  xhr.onreadystatechange = function() { //﻿(3) 응답시, 이에 대한 반응 및 처리해야할 작업(이벤트핸들러 등 )을 작성함
      if (xhr.readyState === 4) {   // (수신 완료, XMLHttpRequest.DONE : 4)
          if (xhr.status === 200) { // (통신 성공)
              console.log(xhr.responseText);
          } else {
              console.log('서버 에러 발생');
          }
      } else { // 통신 완료 전
          console.log('통신중...');
      }
  }
  // xhr.send(JSON.stringify(data)); //﻿(5) 요청을 전송하고 통신을 시작
  xhr.send();

}
