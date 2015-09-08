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

App.toggleReactiveArray = function (reactiveArray, value) {
  var currArray = reactiveArray.get()
  if (currArray.indexOf(value) > -1) {
    currArray = _.without(currArray, value)
  } else {
    currArray.push(value)
  }
  reactiveArray.set(currArray)
}
