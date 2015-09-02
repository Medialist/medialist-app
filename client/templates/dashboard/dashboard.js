var filterState = new ReactiveVar()

Template.dashboard.onCreated(function () {
  Meteor.subscribe('recentPosts')
})

Template.dashboard.helpers({
  allMedialists: function () {
    return Medialists.find({})
  },
  posts: function () {
    var query = {}
    var slug = filterState.get()
    if (slug) {
      query.medialists = slug
    }
    return Posts.find(query, {
      sort: { createdAt: -1 },
      limit: 10
    })
  }
})

Template.dashboard.events({
  'click [data-filter]': function (evt, tpl) {
    var filter = tpl.$(evt.currentTarget).data('filter')
    filterState.set(filter)
  }
})
