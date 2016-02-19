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

App.pushRecentMedialist = function (slug) {
  var recentRaw = localStorage.getItem('medialist/recentMedialists')
  var recents = recentRaw ? JSON.parse(recentRaw) : []
  recents.push(slug)
  if (recents.length > 5) recents.shift()
  localStorage.setItem('medialist/recentMedialists', JSON.stringify(recents))
}

App.getRecentMedialists = function () {
  var recentRaw = localStorage.getItem('medialist/recentMedialists')
  return recentRaw ? JSON.parse(recentRaw) : []
}
