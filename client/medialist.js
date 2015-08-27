Meteor.startup(function () {
  $.material.init()
  Meteor.subscribe('userData')
  Meteor.subscribe('medialist-favourites')
})
