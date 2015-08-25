var helpers = {
  getPath: function (route, params, queryParams) {
    params = App.cleanSBArgument(params)
    queryParams = App.cleanSBArgument(queryParams)
    return FlowRouter.path(route, params, queryParams)
  }
}

_.each(helpers, function (helper, name) {
  Template.registerHelper(name, helper)
})
