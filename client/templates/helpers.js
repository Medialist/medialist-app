var helpers = {
  getPath: function (route, params, queryParams) {
    params = App.cleanSBArgument(params)
    queryParams = App.cleanSBArgument(queryParams)
    return FlowRouter.path(route, params, queryParams)
  },
  equal: function (x, y) {
    return x === y
  },
  getMedialists: function (contact) {
    contact = contact || this
    var medialistSlugs = Object.keys(contact.medialists)
    return Medialists.find({slug: {$in: medialistSlugs}})
  },
  statuses: function () {
    return _.values(Contacts.status)
  },
  classify: function (string) {
    return s.slugify(string)
  }
}

_.each(helpers, function (helper, name) {
  Template.registerHelper(name, helper)
})
