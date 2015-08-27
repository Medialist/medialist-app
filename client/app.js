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
