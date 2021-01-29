<script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/6.4.9/swiper-bundle.min.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/6.4.9/swiper-bundle.css" crossorigin="anonymous" />

<style>
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
</style>

<!-- Slider main container -->
<div class="swiper-container">
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

</div>

<script>
$().ready(function(){
  $(".swiper-slide").hide();//hide template at start.

  

function getFeatured()
{
  baseUrl = "https://koduworlds.azurewebsites.net/top"
  let urlArgs= "?first=0&count=6"
  url=baseUrl+urlArgs
  
  $.post( url, function( data ) {
      for(world of data)
      {
          //copy first item (template)
          let item=$(".swiper-slide").first().clone();
          //and fill it in with world data
          item.find("[data-type='worldname']").text(world.Name);
          item.find("[data-type='authorname']").text("by "+world.Creator);
          item.find("[data-type='thumbnail']").attr("src","https://koduworlds.azurewebsites.net/thumbnail/"+world.PrimaryId)
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
          slideShadows: true,
        },
        pagination: {
          el: '.swiper-pagination',
        },
      });
  });
}
getFeatured()
    
});


</script>
