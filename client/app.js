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

Blaze.TemplateInstance.prototype.get = function(key) {
  var checkForKey = function(view) {
    if (view && view.template instanceof Blaze.Template) {
      var template = view.templateInstance()
      if (typeof template[key] !== 'undefined') return template[key]
    }
    if (view.parentView) return checkForKey(view.parentView)
  }
  return checkForKey(this.view)
}
