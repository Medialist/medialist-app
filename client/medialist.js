Meteor.startup(function () {
  Meteor.subscribe('userData')
  Meteor.subscribe('medialist-favourites')
})
