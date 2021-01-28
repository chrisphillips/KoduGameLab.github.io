var curFirst=0;
var curCount=6*6;//six rows of six each
$().ready(function(){
    //console.log("here");
    $(".world-item").hide();//hide template at start.
    jQuery.timeago.settings.strings.minute = "1 minute";//remove "about" (ug)
    jQuery.timeago.settings.strings.hour = "1 hour";
    jQuery.timeago.settings.strings.hours = "%d hours";
    
    let url = "https://koduworlds.azurewebsites.net/latest"
    let urlArgs= "?first="+curFirst+"&count="+curCount
    let search = document.URL.split("?q=")[1]
    if(search)
    {
        url = "https://koduworlds.azurewebsites.net/search/"+search
        $("[data-type='resulttitle']").text("Results for:"+search)
    }
    let top = document.URL.split("?top=")[1]
    if(top)
    {
        url = "https://koduworlds.azurewebsites.net/top"
        $("[data-type='resulttitle']").text("Top worlds")
    }    
    //console.log("there");
    $.post( url+urlArgs, function( data ) {
        //console.log(data);
        //$("#text").html(data["text"]);
        for(world of data)
        {
            //copy first item (template)
            let item=$(".world-item").first().clone();
            //and fill it in with world data
            item.find("[data-type='worldname']").text(world.Name);
            item.find("[data-type='authorname']").text("by "+world.Creator);
            item.find("[data-type='ago']").text(world.Modified);
            item.find("[data-type='ago']").attr("datetime",world.Modified);
            item.find("[data-type='thumbnail']").attr("src","https://koduworlds.azurewebsites.net/thumbnail/"+world.PrimaryId)
            item.show();//defaults to hidden so show.
            
            item.on("click",function(e){
                console.log(e.currentTarget)
                $(".world-item").removeClass("zoom")
                $(e.currentTarget).addClass("zoom")
            })

            $(".world-container").append(item );
        }
        $(".timeago").timeago();
    });
});
