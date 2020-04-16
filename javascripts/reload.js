function reloadMain(){
       document.getElementById("searchResultPage").innerHTML=`<div class="SNS" style="background-color: yellow"><h1>여기는 SNS</h1>
         <button id="createBtn" type="button" onclick="window.open('create', 'win', 'width=800, height=800, top=80, left=550')">새 글 작성</button>
       </div>
       <div class="Ranking"  style="background-color: green"><h1>여기는 친구들 랭킹</h1></div>`;
}
