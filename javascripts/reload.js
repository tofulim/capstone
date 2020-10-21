function reloadMain(){
       history.pushState({data:"main"}, null, "/main");
       $.get("/main", {input : "refresh"}, function(data){
         $('#searchResultPage').html(data);
       });

}
