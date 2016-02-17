Template.avatar.onRendered(function () {
  if (!this.data.avatar) return
  var img = new Image(40, 40)
  img.onload = () => { this.firstNode.src = img.src }
  img.onerror = () => { Meteor.call('twitter/updateAvatar', this.data.twitter.id) }
  img.src = this.data.avatar
})
