Template.mainmenu.events({
  'click [data-action="hide-mainmenu"]': function () {
    SlideIns.hide('left')
  }
})

Template.mainmenu.helpers({
  profileImage: function () {
    var user = Meteor.user();
    if (!user || !user.services) return null;
    return user.services.twitter.profile_image_url_https;
  },
  medialists: function () {
    return Medialists.find({}, {sort:['slug']}).fetch()
  }
})