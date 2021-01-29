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

<section class="section">
    <div class="container">
        <div class="columns">
            <div class="column is-12">
                <div class="columns is-multiline world-container">
                      <div class="column is-12">
                          <p data-type='resulttitle' style='float: left;' class="title is-3">Latest Worlds
                          </p>
                          <div class='button sort-button'>Top</div>
                          <div class='button sort-button is-primary'>Latest</div>
                          <input class="input search" type="text" placeholder="Search" style="float:right;width:200px;margin:3px;">                        
                      </div>
                      <div class="column is-2-desktop is-4-tablet world-item">
                        <a href="">
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
                              <p>
                                <time data-type='ago' class="timeago title is-7 has-text-right">X days Ago</time>
                              </p>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                      <div class="column is-12">
                          <p data-type='more-button' style='float:left' class="title is-3">Loading...
                          </p>
                          <div style='float:right' class='button more-button is-primary'>Moar</div>
                      </div>              
                    <nav class="pagination is-rounded" role="navigation" aria-label="pagination">
                      <a class="pagination-next">Next page</a>
                      <ul class="pagination-list" style="list-style: none;">
                        <li><a class="pagination-link is-current" aria-label="Page 1" aria-current="page">1</a></li>
                        <li><a class="pagination-link" aria-label="Goto page 2">2</a></li>
                      </ul>
                    </nav>                  
               
            </div>
        </div>
    </div>
</section>

<div class="modal">
  <div class="modal-background"></div>
  <div class="modal-card">
  </div>

</div>

<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-timeago/1.6.7/jquery.timeago.min.js" crossorigin="anonymous"></script>


<script>

var baseUrl = "https://koduworlds.azurewebsites.net/latest"
function getWorldsPage(url)
{
  $.post( url, function( data ) {
      for(world of data)
      {
          //copy first item (template)
          let item=$(".world-item").first().clone();
          //and fill it in with world data
          item.find("[data-type='worldname']").text(world.Name);
          item.find("[data-type='authorname']").text("by "+world.Creator);
          item.find("[data-type='description']").text(world.Description);
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
    
    let search = document.URL.split("?q=")[1]
    if(search)
    {
        baseUrl = "https://koduworlds.azurewebsites.net/search/"+search
        $("[data-type='resulttitle']").text("Results for:"+search)
    }
    let top = document.URL.split("?top=")[1]
    if(top)
    {
        baseUrl = "https://koduworlds.azurewebsites.net/top"
        $("[data-type='resulttitle']").text("Top worlds")
    }    
    //console.log("there");
    $(".modal-background").on("click",function(e){
      $(".is-active").removeClass("is-active")
    })
    
    $(".search").on("input",function(){
      let filter = $(".search").val()
      console.log(filter);
      let newPath = document.location.origin+document.location.pathname+'/?q='+filter
      console.log(newPath);
      if(document.location.search.indexOf("?top=1") ||document.location.search.indexOf("&top=1"))
      {
        newPath+="&top=1" //todo proper path appending.
      }

      window.history.pushState({
          id: 'search'
      }, 'Search | Kodu Worlds', newPath);
    });
    
    $(".sort-button").on("click",function(e){
      let text = $(e.target).html();
      console.log(text);
      if(text=="Top")
      {
        $(".sort-button").removeClass("is-primary")
        $(e.target).addClass("is-primary")
      }
    });    
    
    let curFirst=0;
    let curCount=6*6;//six rows of six each
    $(".more-button").on("click",function(){
      let urlArgs= "?first="+curFirst+"&count="+curCount
      getWorldsPage(baseUrl+urlArgs)
      curFirst+=curCount;
    });  
    
  
  
    let urlArgs= "?first="+curFirst+"&count="+curCount
    getWorldsPage(baseUrl+urlArgs)
    curFirst+=curCount;

});
</script>
