$.ZPFnName = (fn) ->
  fn.name || (fn + '').split(/\s|\(/)[1]


$.ZPInit = (fn, name, set = true) ->
  window.ZP = window.ZP || {}
  window.ZP.apps = window.ZP.apps || {}
  if fn && set
    name = name || $.ZPFnName(fn)
    window.ZP.apps[name] = fn

$.ZPPluggin = (fn, name, bypass = false, elPluggin = true) ->
  obj = {}
  $.ZPInit(fn, name, true)
  name = name || $.ZPFnName(fn)
  obj[name] = (option, args...) ->
    @each -> 
      $this = $(this)
      key = 'zp-'+name
      data = $this.data(key)
      if !data || bypass
        $this.data 'name', name
        $this.data key, (data = new fn(option, this))
      if typeof option == 'string'
        data[option].apply(data, args)
    return
  $.fn.extend obj 

  if !elPluggin
    obj[name] = (option) ->
      new fn(option)
    $.extend obj