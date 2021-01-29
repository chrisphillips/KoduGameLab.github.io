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
    width: 300px;
    height: 300px;
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
          <p data-type='description' class="description subtitle is-6">Description</p>  
          <div class='button is-primary'>Download</div>
          <p>
            <time data-type='ago' class="timeago title is-7 has-text-right">X days Ago</time>
          </p>
        </div>
      </div>
    </div>
    <div class="swiper-slide">
    
    
    
    </div>
    <div class="swiper-slide">Slide 3</div>
  </div>
  <!-- If we need pagination -->
  <div class="swiper-pagination"></div>

</div>

<script>
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
  
</script>
