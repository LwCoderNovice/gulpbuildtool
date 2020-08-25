class ZPModule
  defaults: {}

  constructor: (options, element) ->

    @init()
  
  init: ->
    @key = 
      esc: 27

$.ZPInit(ZPModule, 'ZPModule')