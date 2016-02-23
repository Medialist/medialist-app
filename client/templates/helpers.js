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
    var medialistSlugs = contact.medialists
    return Medialists.find({
      slug: {
        $in: medialistSlugs
      }
    })
  },
  statuses: function () {
    return _.values(Contacts.status)
  },
  classify: function (string) {
    return s.slugify(string)
  },
  fromNow: function (date) {
    return moment(Math.min(date, new Date() - 1)).fromNow()
  },
  dateFormat: function (date, format) {
    return moment(date).format(format)
  },
  instance: function() {
    return Template.instance()
  },
  medialistSlug: function () {
    FlowRouter.watchPathChange()
    return FlowRouter.getParam('medialistSlug')
  },
  contactQuerySlug: function () {
    FlowRouter.watchPathChange()
    return FlowRouter.getQueryParam('contact')
  },
  medialistQuerySlug: function () {
    FlowRouter.watchPathChange()
    return FlowRouter.getQueryParam('medialist')
  },
  firstName: App.firstName,
  profileImage: function () {
    var user = Meteor.user();
    if (!user || !user.services) return null;
    return user.services.twitter.profile_image_url_https;
  },
  youOrName: function (user) {
    if (user && user._id === Meteor.userId()) return 'You'
    return user && user.name
  },
  emailTypes: function () {
    return Contacts.emailTypes
  },
  phoneTypes: function () {
    return Contacts.phoneTypes
  },
  socialTypes: function () {
    return Contacts.socialTypes
  },
  fieldName(a, index, b) {
    var res = [a, index, b].join('.')
    return res
  },
  or: (x, y) => x || y,
  and: (x, y) => x && y,
  not: x => !x
}

_.each(helpers, function (helper, name) {
  Template.registerHelper(name, helper)
})
