---
title: Kodu Game Lab
subtitle: 3D game programming for kids.
layout: page
hide_hero: true
show_sidebar: false
---

<style>
.world-item .button {
  display: none;
}
.world-item .description {
  display: none;
}
.world-item .downloads {
  color: blue;
  float: right;
}  
.modal.world-item .description {
  display: unset;
  color: green;
}
.modal .button
{
  display:unset;
  float: right;
  margin: 10px;
}
.sort-button
{
  float: right;
  margin: 3px;
}
.modal-open {
    overflow: initial;
}  
</style>

<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-timeago/1.6.7/jquery.timeago.min.js" crossorigin="anonymous"></script>

{% include_relative featured.md %}

<section class="section">
    <div class="container">
        <div class="columns">
            <div class="column is-12">
                <div class="columns is-multiline world-container">
                      <div class="column is-12">
                          <p data-type='resulttitle' style='float: left;' class="title is-3">Latest Worlds
                          </p>
                          <form>
                            <div type="submit" class='button sort-button'>Top</div>
                            <div type="submit" class='button sort-button is-primary'>Latest</div>
                            <input class="input search" type="text" placeholder="Search" style="float:right;width:200px;margin:3px;">
                          </form>                        
                      </div>
                      <div class="column is-2-desktop is-4-tablet world-item">
                        <a data-type='worldref' href="#">
                          <div class="card">
                            <div class="card-image">
                              <figure class="image is-4by3">
                                <img data-type='thumbnail' src="https://via.placeholder.com/128x128" alt="World Name">
                              </figure>
                            </div>
                            <div class="card-content p-3">
                              <p data-type='worldname' class="title is-6">World Name</p>
                              <p data-type='authorname' class="subtitle is-6">by Author Name</p>  
                              <p data-type='description' class="description subtitle is-6">Description</p>  
                              <div class='button is-primary'>Download</div>
                              <p data-type='downloads' class="downloads subtitle is-6">1234</p>  
                              <p>
                                <time data-type='ago' class="timeago title is-7 has-text-right">X days Ago</time>
                              </p>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                      <div class="column is-12">
                          <p data-type='more-button' id='loading-message' style='float:left' class="title is-3">Loading...
                          </p>
                          <div style='float:right' class='button more-button is-primary'>Load More</div>
                      </div>              
               
            </div>
        </div>
    </div>
</section>

<div class="modal">
  <div class="modal-background"></div>
  <div class="modal-card">
  </div>

</div>



<script>

function getWorldsPage(url)
{
  console.log("getWorldsPage" + url);
  
  $.post( url, function( data ) {
      if(data.length==0)
      {
        console.log("Got Zero Search Results")
        $("#loading-message").hide();
        $(".more-button").remove();//hack to stop auto scroll. todo. better fix.
      }
      for(world of data)
      {
          //copy first item (template)
          let item=$(".world-item").first().clone();
          //and fill it in with world data
          item.find("[data-type='worldref']").attr("href","#"+world.PrimaryId);
          item.find("[data-type='worldname']").text(world.Name);
          item.find("[data-type='authorname']").text("by "+world.Creator);
          item.find("[data-type='description']").text(world.Description);
          item.find("[data-type='downloads']").text(world.Downloads+"⇩" ); /* &#8681 */
          item.find("[data-type='ago']").text(world.Modified);
          item.find("[data-type='ago']").attr("datetime",world.Modified);
          item.find("[data-type='thumbnail']").attr("src","https://koduworlds.azurewebsites.net/thumbnail/"+world.PrimaryId)
          item.show();//defaults to hidden so show.

          item.on("click",function(e){
              console.log(e.currentTarget)
              //$(".world-item").removeClass("zoom")
              $(".modal").addClass("is-active")
              $(".modal-card").html($(e.currentTarget).html())
          })

          $(".world-container").append(item );
      }
      $(".timeago").timeago();
  });
}  
  
  
$().ready(function(){
    //console.log("here");
    $(".world-item").hide();//hide template at start.
    jQuery.timeago.settings.strings.minute = "1 minute";//remove "about" (ug)
    jQuery.timeago.settings.strings.hour = "1 hour";
    jQuery.timeago.settings.strings.hours = "%d hours";
    
    let baseUrl = "https://koduworlds.azurewebsites.net/latest"

    let search = document.URL.split("?q=")[1]
    if(search && search.trim().length>0)
    {
        baseUrl = "https://koduworlds.azurewebsites.net/search/"+search
        $("[data-type='resulttitle']").text("Results for:"+search)
        $(".search").val(search)
    }else
    {  
      initFeatured();
    }
    let top = document.URL.split("?top=")[1]
    if(top && top.trim().length>0)
    {
        baseUrl = "https://koduworlds.azurewebsites.net/top"
        $("[data-type='resulttitle']").text("Top worlds")
    }    
    //console.log("there");
    $(".modal-background").on("click",function(e){
      $(".is-active").removeClass("is-active")
      //remove anchor (#) from url
      history.pushState({}, "", document.location.href.split('#')[0]);
    })
    
    $(".search").on("input",function(){
      let filter = $(".search").val()
      console.log(filter);
      let newPath = document.location.origin+document.location.pathname+'?q='+filter
      console.log(newPath);
      if(document.location.search.indexOf("?top=1")>-1 ||document.location.search.indexOf("&top=1")>-1)
      {
        newPath+="&top=1" //todo proper path appending.
      }

      window.history.pushState({
          id: 'search'
      }, 'Search | Kodu Worlds', newPath);
    });
    
    $(".searchxx").on("keyup",function(event) {
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        //document.getElementById("myBtn").click();
        window.location=document.location.href
      }
    });

    
    $(".sort-buttonxx").on("click",function(e){
      let text = $(e.target).html();
      console.log(text);
      $(".sort-button").removeClass("is-primary")
      $(e.target).addClass("is-primary")
      if(text=="Top")
      {
            let newPath = document.location.origin+document.location.pathname
            newPath+="?top=1"
            let filter = $(".search").val().trim();
            if(filter.length)
              newPath+='&q='+filter
            console.log("newPath");
            window.location=(newPath)
      }
    });    
    
    let curFirst=0;
    let curCount=6*6;//six rows of six each
    $(".more-button").on("click",function(){
      let urlArgs= "?first="+curFirst+"&count="+curCount
      getWorldsPage(baseUrl+urlArgs)
      curFirst+=curCount;
    });  
    
    //Infinite Scroll
    $(window).on("scroll", function() {
     var scrollHeight = $(document).height();
     var scrollPos = $(window).height() + $(window).scrollTop();
     if(((scrollHeight - 300) >= scrollPos) / scrollHeight == 0){
       $('.more-button').click();
      }
    });  
  
    let urlArgs= "?first="+curFirst+"&count="+curCount
    getWorldsPage(baseUrl+urlArgs)
    curFirst+=curCount;

});
</script>

