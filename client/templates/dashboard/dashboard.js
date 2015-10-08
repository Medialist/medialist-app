var filterState = new ReactiveVar()

Template.dashboard.onCreated(function () {
  Meteor.autorun(function () {
    var opts = {
      limit: 10,
      types: ['need-to-knows', 'medialists changed', 'feedback']
    }
    var slug = filterState.get()
    if (slug) {
      opts.medialist = slug
    }
    Meteor.subscribe('posts', opts)
  })
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
