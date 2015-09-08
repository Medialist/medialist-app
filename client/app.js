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

App.updateSort = function (sortBy, sortField) {
  var sortedBy = sortBy.get()
  if (sortedBy[sortField]) {
    sortedBy[sortField] = -sortedBy[sortField]
  } else {
    sortedBy = {}
    sortedBy[sortField] = 1
  }
  sortBy.set(sortedBy)
}
