# Swiper = require 'swiper' 

class carouselBanner extends ZP.apps.ZPModule
    init: ->
      @events()
    
    events: ->
      # mySwiper = new Swiper @.target

$.ZPPluggin(carouselBanner, 'carouselBanner', true)