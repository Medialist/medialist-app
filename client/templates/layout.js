Template.Layout.events({
  'click [data-action="logout"]': function () {
    Meteor.logout(function (err) {
      if (err) return console.error(err)
      FlowRouter.go('home')
    })
  },
  'click [data-action="login"]': function () {
    Meteor.loginWithTwitter()
  }
})

// Specifying an onLogin callback is preferable to passing a callback to
// Meteor.loginWith... as if we ever need to use redirect login style it
// won't get called
Accounts.onLogin(function () {
  if (FlowRouter.current().route.group.name === 'public') {
    FlowRouter.go('dashboard')
  }
})
