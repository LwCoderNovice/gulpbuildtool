class carouselBanner extends ZP.apps.ZPModule
    init: ->
      @events()
    
    events: ->
      console.log("a")

$.ZPPluggin(carouselBanner, 'carouselBanner', true)