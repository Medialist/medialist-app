App.breadcrumbs = new ReactiveVar([
  {
    text: 'Contact',
    route: 'dashboard'
  },
  {
    text: 'Will Findlater',
    route: 'dashboard'
  }
])

App.cleanSBArgument = function (arg) {
  return (arg instanceof Spacebars.kw) ? undefined : arg
}

App.toggleReactiveObject = function (reactiveObject, key) {
  var currObj = reactiveObject.get()
  if (currObj[key]) {
    delete currObj[key]
  } else {
    currObj[key] = true
  }
  reactiveObject.set(currObj)
}

App.escapeContentEditable = text => {
  
}
