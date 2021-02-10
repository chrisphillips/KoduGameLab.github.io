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
                          <button id="top-button" class='button sort-button'>Top</button>
                          <button id="latest-button" class='button sort-button'>Latest</button>
                          <input class="input search" type="text" placeholder="Search" style="float:right;width:200px;margin:3px;">
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

function hexToBase64(str) {
  return btoa(String.fromCharCode.apply(null,
    str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
  );
}

function base64ToHex(str) {
  for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
    var tmp = bin.charCodeAt(i).toString(16);
    if (tmp.length === 1) tmp = "0" + tmp;
    hex[hex.length] = tmp;
  }
  return hex.join("");
}

function decodeGuid(encodedGuid)
{
      //"dTZs7fWnRkygPa6j0RjR0g=="
      var decoded = base64ToHex(encodedGuid);
      document.getElementById('out').innerHTML = decoded;

      var chunks = [];
      chunks.push( decoded.substring(0, 8) );
      chunks.push( decoded.substring(8, 12) );
      chunks.push( decoded.substring(12, 16) );
      chunks.push( decoded.substring(16, 20) );
      chunks.push( decoded.substring(20) );
      decoded = chunks.join("-");
}

  
$().ready(function(){
    //console.log("here");
    $(".world-item").hide();//hide template at start.
    jQuery.timeago.settings.strings.minute = "1 minute";//remove "about" (ug)
    jQuery.timeago.settings.strings.hour = "1 hour";
    jQuery.timeago.settings.strings.hours = "%d hours";
    
    //get url params
    var params={};
    window.location.search
      .replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str,key,value) {
        params[key] = value;
      }
    );

    //q in url is search query (if any)
    let search = params["q"]
    if(search && search.trim().length>0)
    {
        //update section title and search bar
        $("[data-type='resulttitle']").text("Results for:"+search)
        $(".search").val(search)
    }else
    {  
      search=""
      initFeatured();
    }
    
    //get top flag from url
    let top = parseInt(params["top"])
    if(!top)
      top=0;

    //setup page for top or latest  
    if(top>0)
    {
        $("[data-type='resulttitle']").text("Top worlds")
        $("#top-button").addClass("is-primary");
        $("#latest-button").on("click",function(){
          doNav($(".search").val(),0)//toggle top/latest
        });
    }else{
        $("[data-type='resulttitle']").text("Latest worlds")
        $("#latest-button").addClass("is-primary");
        $("#top-button").on("click",function(){
          doNav($(".search").val(),1)//toggle top/latest
        });
    }

    //if a world id was specified fetch that world meta and display in modal
    if(window.location.hash){
      let guid = window.location.hash.slice(1)//slice removes # at start.

      //handle base64 guids
      if(guid.length==24 && guid[22]=='=' && guid[23]=='=') //base64 guid?
      {
        guid=decodeGuid(guid)
      }

      if(guid.length==36){//minimal sanity check. 36 = len of guid
        let dataUrl = "https://koduworlds.azurewebsites.net/world/"+guid
        //todo validate guid.
        $.get( dataUrl, function( world ) {
            //todo handle error 
            //console.log("Got Zero Search Results")
            if(world)
            {
              //copy first item (template)
              let item=$(".world-item").first().clone();
              //and fill it in with world data
              item.find("[data-type='worldref']").attr("href","#"+world.WorldId);
              item.find("[data-type='worldname']").text(world.Name);
              item.find("[data-type='authorname']").text("by "+world.Creator);
              item.find("[data-type='description']").text(world.Description);
              item.find("[data-type='downloads']").text(world.Downloads+"⇩" ); /* &#8681 */
              item.find("[data-type='ago']").text(world.Modified);
              item.find("[data-type='ago']").attr("datetime",world.Modified);
              item.find("[data-type='thumbnail']").attr("src","https://koduworlds.azurewebsites.net/thumbnail/"+world.WorldId)
              item.show();//defaults to hidden so show.
              
              item.on("click",function(e){
                  console.log(e.currentTarget)
                  //$(".world-item").removeClass("zoom")
                  $(".modal").addClass("is-active")
                  $(".modal-card").html($(e.currentTarget).html())
              })
              //todo. maybe hide.
              $(".world-container").append(item );

              //Immediately pop up in a modal
              item.click();
              //$(".modal").addClass("is-active")
              //$(".modal-card").html($(e.currentTarget).html())
            }

        });
      }
    }
    
    //handle close modal on background click
    $(".modal-background").on("click",function(e){
      $(".is-active").removeClass("is-active")
      //remove anchor (#) from url
      history.pushState({}, "", document.location.href.split('#')[0]);
    })

    //handle Enter in search box.
    $(".search").on("keyup",function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        doNav($(".search").val(),top)
      }
    });

    //handle navigation
    function doNav(search,sortBy)
    {
      let newPath = document.location.origin+document.location.pathname
      let filter = search.trim();
      
      if(sortBy && sortBy!=0)
        sortBy=1;
      else
        sortBy=0;

      //todo? don't include top=0 since it is default
      newPath+='?top='+sortBy  
      if(filter.length)
        newPath+='&q='+filter  
        
      console.log("newPath");
      window.location=(newPath)
    }
    
    //pageing for worlds results
    let curFirst=0;
    let curCount=6*6;//six rows of six each
    let curSearch=search;

    var fetchingPage=false;
    function getWorldsPage()
    {
      if(fetchingPage)
        return;
      fetchingPage=true;

      //todo change to post search api
      let urlArgs= "?first="+curFirst+"&count="+curCount+"&sortBy="+top
      baseUrl = "https://koduworlds.azurewebsites.net/search/"+curSearch
      let url=baseUrl+urlArgs
      curFirst+=curCount;

      console.log("getWorldsPage:" + url);

      $.get( url, function( data ) {
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
              item.find("[data-type='worldref']").attr("href","#"+world.WorldId);
              item.find("[data-type='worldname']").text(world.Name);
              item.find("[data-type='authorname']").text("by "+world.Creator);
              item.find("[data-type='description']").text(world.Description);
              item.find("[data-type='downloads']").text(world.Downloads+"⇩" ); /* &#8681 */
              item.find("[data-type='ago']").text(world.Modified);
              item.find("[data-type='ago']").attr("datetime",world.Modified);
              item.find("[data-type='thumbnail']").attr("src","https://koduworlds.azurewebsites.net/thumbnail/"+world.WorldId)
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
          fetchingPage=false;
      });
    } //end getWorldPage() 
  


    //dummy button used by infinite scroll
    $(".more-button").on("click",function(){
      getWorldsPage()
    });  
    
    //Infinite Scroll
    $(window).on("scroll", function() {
     var scrollHeight = $(document).height();
     var scrollPos = $(window).height() + $(window).scrollTop();
     if(((scrollHeight - 300) >= scrollPos) / scrollHeight == 0){
       $('.more-button').click();
      }
    });  
  
    //Start by getting first page of results
    getWorldsPage()

});
</script>

