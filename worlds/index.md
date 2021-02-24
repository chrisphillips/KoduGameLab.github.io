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
                          <div class="navbar-item has-dropdown is-hoverable" style="float:right">
                            <div id='range' class="navbar-link">
                              All
                            </div>
                            <div id="rangeDropdown" class="navbar-dropdown ">
                              <a class="navbar-item " href="#">
                                All
                              </a>
                              <a class="navbar-item " href="#">
                                Year
                              </a>
                              <a class="navbar-item " href="#">
                                Month
                              </a>
                              <a class="navbar-item " href="#">
                                Week
                              </a>
                            </div>
                          </div>
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
                              <a data-type='download-link' class='button is-primary'>Download</a>
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

      // 75366ced-f5a7-464c-a03d-aea3d118d1d2
      // 75366ced-f5a7-464c-a03d-aea3d118d1d2

      // 38DB4312-DEDF-4EC1-84DC-2B31974A5926

      // 49bc134b-8620-2a46-974b-b2e6286ebb4d

      // 4B13BC49-2086-462A-974B-B2E6286EBB4D
      // 4b13bc49-2086-462a-974b-b2e6286ebb4d

      //ns[0]=os[]

      var decoded = base64ToHex(encodedGuid);

      var chunks = [];
      chunks.push( decoded.substring(6, 8)+
                  decoded.substring(4, 6)+
                  decoded.substring(2, 4)+
                  decoded.substring(0, 2) 
        );
      chunks.push( 
        decoded.substring(10, 12) +
        decoded.substring(8, 10) 
        );
      chunks.push( 
        decoded.substring(14, 16)+ 
        decoded.substring(12, 14) 
      );
      chunks.push( decoded.substring(16, 20) );
      chunks.push( decoded.substring(20) );
      decoded = chunks.join("-");
      return (decoded)
}
decodeGuid("SbwTS4YgKkaXS7LmKG67TQ==")
//TODO. Page caching may not be working right!!
//Todo. MrPresident levels all white.
//todo. sudden 502 on thumbs. 
//todo. fix short encoding on world page
  
$().ready(function(){
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
    if(search)
      search=decodeURIComponent(search)
    if(search && search.trim().length>0)
    {
        //update section title and search bar
        $("[data-type='resulttitle']").text("Results for:"+search)
        $(".search").val(search)
    }else
    {  
      search=""//Make sure str is blank
    }

    //Show featured if not doing any sort of query
    if(window.location.search=="")
      initFeatured();
    
    let sortBy=params["sortBy"]
    if(!sortBy)
      sortBy='date';  //by default 

    let range=params["range"]
    if(!range)
      range='all';//by default
  
    if(sortBy=='date')//if sorting by date
    {
      range='all';//then range is always all
      $("#range").parent().hide();//range drop down isnt needed.
    }

    //setup page for top or latest  
    if(sortBy=='date')
    {
      $("[data-type='resulttitle']").text("Latest worlds")
      $("#latest-button").addClass("is-primary");
      $("#top-button").on("click",function(){
        doNav($(".search").val(),"downloads",range)//toggle top/latest
      });
    }else{
      $("[data-type='resulttitle']").text("Top worlds")
      $("#top-button").addClass("is-primary");
      $("#latest-button").on("click",function(){
        doNav($(".search").val(),"date",range)//toggle top/latest
      });
    }

    //Set range drop down label
    let capitalized=range.charAt(0).toUpperCase()+range.slice(1);
    $("#range").html(capitalized);

    //Handle range drop down click navigation
    $("#rangeDropdown a").on("click",function(e){
      doNav($(".search").val(),sortBy,e.target.innerHTML.trim().toLocaleLowerCase())
    });


    //if a world id was specified fetch that world meta and display in modal
    if(window.location.hash){
      let guid = window.location.hash.slice(1)//slice removes # at start.

      //handle base64 guids.
      //todo. Fix. Not working
      if(guid.length==24 && guid[22]=='=' && guid[23]=='=') //base64 guid?
      {
        guid=decodeGuid(guid)
      }

      if(guid.length==36){//minimal sanity check. 36 = len of guid
        let dataUrl = "https://koduworlds.azurewebsites.net/world/"+guid
        //todo validate guid.
        $.get( dataUrl, function( world ) {
            //todo handle error. Fill in modal with World Not Found? 
            //console.log("Got Zero Search Results")
            if(world)
            {
              //todo. unify this code with pageload version
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
              item.find("[data-type='download-link']").attr("href","https://koduworlds.azurewebsites.net/download/"+world.WorldId+"?fn="+
                createDotKoduFilename(world.Name,world.Creator))
              item.show();//template defaults to hidden so show.

              //item.find("[data-type='download-link']").attr("download",   createDotKoduFilename(world.Name,world.Creator))

              item.on("click",function(e){
                  //console.log(e.currentTarget)
                  $(".modal").addClass("is-active")
                  $(".modal-card").html($(e.currentTarget).html())
              })

              //todo. maybe hide this item.
              $(".world-container").append(item );

              //Immediately pop up in a modal
              item.click();
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
        doNav($(".search").val(),sortBy,range)
      }
    });

    //handle navigation including building url
    function doNav(search,sortBy,range)
    {
      let newPath = document.location.origin+document.location.pathname
      let filter = search.trim();
     
      //if(sortBy!='date') //todo? don't include if date since it is default
        newPath+='?sortBy='+sortBy  
      if(range!='all')//dont include if default (all). 
        newPath+='&range='+range  

      if(filter.length)//add search string
        newPath+='&q='+filter  
        
      //console.log(newPath);
      window.location=newPath
    }
    
    //todo. move to util file
    function createDotKoduFilename(levelTitle, levelCreator)
    {
        // Clean up the title and creator if needed
        levelTitle = levelTitle.trim();
        if (levelTitle=="")
            levelTitle = "Level";
        else if (levelTitle.length > 32)
        {
            levelTitle = levelTitle.substring(0, 32);
            levelTitle = levelTitle.trim();
        }

        levelCreator = levelCreator.trim();
        if (levelCreator=="")
            levelCreator = "Unknown";
        else if (levelCreator.length > 32)
        {
            levelCreator = levelCreator.substring(0, 32);
            levelCreator = levelCreator.trim();
        }

        // Get rid of invalid characters
        let illegalRe = /[\/\?<>\\:\*\|":]/g;
        let controlRe = /[\x00-\x1f\x80-\x9f]/g;
        let reservedRe = /^\.+$/;
        let windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;

        function sanitize(input, replacement) {
          let sanitized = input
            .replace(illegalRe, replacement)
            .replace(controlRe, replacement)
            .replace(reservedRe, replacement)
            .replace(windowsReservedRe, replacement);
          return sanitized;
        }
        let newName = levelTitle+", by "+levelCreator;
        newName=sanitize(newName,"-");//+".kodu";//todo is this the right way to handle
        // Get rid of invalid characters
        return(encodeURIComponent(newName))

    }

    //pageing for worlds results
    let curFirst=0;
    let curCount=6*6;//six rows of six each
    let curSearch=search;
    let curSort=sortBy;
    let curRange=range;

    var fetchingPage=false;
    function getWorldsPage()
    {
      if(fetchingPage)
        return;
      fetchingPage=true;

      //todo change to post search api
      let urlArgs= "?first="+curFirst+"&count="+curCount+"&sortBy="+curSort+"&range="+curRange;
      baseUrl = "https://koduworlds.azurewebsites.net/search/"+curSearch
      let url=baseUrl+urlArgs
      curFirst+=curCount;

      //console.log("getWorldsPage:" + url);

      $.get( url, function( data ) {
          if(data.length==0 || data.length<curCount)
          {
            //console.log("Got Zero or < Count Search Results")
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
              item.find("[data-type='download-link']").attr("href","https://koduworlds.azurewebsites.net/download/"+world.WorldId+"?fn="+createDotKoduFilename(world.Name,world.Creator))

              //item.find("[data-type='download-link']").attr("download",createDotKoduFilename(world.Name,world.Creator))

              item.show();//defaults to hidden so show.

              item.on("click",function(e){
                  //console.log(e.currentTarget)
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

