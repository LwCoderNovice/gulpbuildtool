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

  map = new BMapGL.Map("map");
  point = new BMapGL.Point(116.404, 39.915);
  map.centerAndZoom(point, 15);


  pt = new BMapGL.Point(116.417, 39.909);
  myIcon = new BMapGL.Icon("/static/images/icons/icon-address.png", new BMapGL.Size(52, 26));
  marker = new BMapGL.Marker(pt);  
  map.addOverlay(marker);              
