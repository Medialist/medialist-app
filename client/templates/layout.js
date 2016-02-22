Template.Layout.events({
  'click [data-action="logout"]': function () {
    Meteor.logout(function (err) {
      if (err) return console.error(err)
      FlowRouter.go('home')
    })
  },
  'click [data-action="login"]': function () {
    Meteor.loginWithTwitter()
  },
  'error img[data-slug]': function (evt) {
    var $img = $(evt.currentTarget)
    if ($img.attr('src') === '/images/avatar.svg') return // bad times. We have lost contact with ground control.
    $img.attr('src', '/images/avatar.svg')
    var slug = $img.attr('data-slug')
    if (!slug) return
    Meteor.call('contacts/updateAvatar', slug)
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
