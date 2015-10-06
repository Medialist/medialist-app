var helpers = {
  getPath: function(route, params, queryParams) {
    params = App.cleanSBArgument(params)
    queryParams = App.cleanSBArgument(queryParams)
    return FlowRouter.path(route, params, queryParams)
  },
  equal: function(x, y) {
    return x === y
  },
  getMedialists: function(contact) {
    contact = contact || this
    var medialistSlugs = contact.medialists
    return Medialists.find({
      slug: {
        $in: medialistSlugs
      }
    })
  },
  statuses: function() {
    return _.values(Contacts.status)
  },
  classify: function(string) {
    return s.slugify(string)
  },
  fromNow: function(date) {
    return date.fromNow()
  },
  instance: function() {
    return Template.instance()
  },
  routeSlug: function() {
    FlowRouter.watchPathChange()
    return FlowRouter.getParam('slug')
  },
  firstName: function(fullName) {
    var ind = fullName.indexOf(' ')
    return ind > -1 ? fullName.substr(0, ind) : fullName
  },
  profileImage: function() {
    var user = Meteor.user();
    if (!user || !user.services) return null;
    return user.services.twitter.profile_image_url_https;
  },
  youOrName: function(user) {
    if (user && user._id === Meteor.userId()) return 'You'
    return user && user.name
  }
}

_.each(helpers, function(helper, name) {
  Template.registerHelper(name, helper)
})
