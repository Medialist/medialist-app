Meteor.publish('userData', function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId}, {fields: {groups: 1, 'services.twitter.profile_image_url_https': 1}});
  } else {
    this.ready();
  }
});
