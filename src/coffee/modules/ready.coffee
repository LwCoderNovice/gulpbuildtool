$(document).ready ->
  $.loadPluggins = ->
    
    
  $.loadPluggins()
  mySwiper = new Swiper '.page-banner',
                        autoplay: true
                        loop: true
                        pagination: 
                          el: '.page-banner .swiper-pagination'
  mySwiper = new Swiper '.hero-banner',
                        autoplay: true
                        loop: true
                        pagination: 
                          el: '.hero-banner .swiper-pagination'