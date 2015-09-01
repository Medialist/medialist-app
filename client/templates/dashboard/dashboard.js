Template.dashboard.helpers({
  posts: function () {
    return Posts.find({}, {
      sort: { createdAt: -1 },
      limit: 10
    })
  }
})
