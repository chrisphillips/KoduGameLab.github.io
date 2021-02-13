<script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/6.4.9/swiper-bundle.min.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/6.4.9/swiper-bundle.css" crossorigin="anonymous" />

<style>
  
  .featured-container {
      /* used https://www.css-gradient.com/ */ 
    background: linear-gradient(to right bottom, rgb(17, 121, 245), rgb(74, 213, 133));
  }

  .swiper-container {
    width: 100%;
    padding-top: 50px;
    padding-bottom: 50px;
  }
  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 400px;
    height: 400px;
  }  

  .swiper-slide .button {
    display: none;
  }
  .swiper-slide .description {
    display: none;
  }
  .modal .description {
    display: unset;
    color: green;
  }
  .modal .button
  {
    display:unset;
    float: right;
    margin: 10px;
  }  
</style>

<!-- Slider main container -->
<div class="swiper-container featured-container">
  <!-- Additional required wrapper -->
  <div class="swiper-wrapper">
    <!-- Slides -->
    <div class="swiper-slide">
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
        </div>
      </div>
    </div>

<!--
    <div class="swiper-slide">
    </div>
-->

  </div>
  <!-- If we need pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add Arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

<script>
$(".swiper-container").hide();//hide template at start.
$(".swiper-slide").hide();//hide template at start.

//$().ready(function(){
var initFeatured=(function(){

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


function getFeatured()
{
  let baseUrl = "https://koduworlds.azurewebsites.net/search"
  let urlArgs= "?first="+parseInt(Math.random()*100)+"&count=7&sortBy=downloads"
  url=baseUrl+urlArgs
  
  $.get( url, function( data ) {
      for(world of data)
      {
          //copy first item (template)
          let item=$(".swiper-slide").first().clone();
          //and fill it in with world data
          item.find("[data-type='worldname']").text(world.Name);
          item.find("[data-type='authorname']").text("by "+world.Creator);
          item.find("[data-type='description']").text(world.Description);
          item.find("[data-type='download-link']").attr("href","https://koduworlds.azurewebsites.net/download/"+world.WorldId+"?fn="+createDotKoduFilename(world.Name,world.Creator))

          item.find("[data-type='thumbnail']").attr("src","https://koduworlds.azurewebsites.net/thumbnail/"+world.WorldId)
          item.show();//defaults to hidden so show.

          item.on("click",function(e){
              console.log(e.currentTarget)
              //$(".world-item").removeClass("zoom")
              $(".modal").addClass("is-active")
              $(".modal-card").html($(e.currentTarget).html())
          })

          $(".swiper-wrapper").append(item );
      }
      
      var swiper = new Swiper('.swiper-container', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        },
        keyboard: {
          enabled: true,
        },        
        pagination: {
          el: '.swiper-pagination',
        },
      });
      
      //unhide feature container now.
      $(".swiper-container").show();
  });
}
getFeatured()
    
});


</script>
