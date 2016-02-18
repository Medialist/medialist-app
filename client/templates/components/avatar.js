Template.avatar.onRendered(function () {
  if (!this.data.avatar || !this.data.socials) return
  var twitterId = this.data.socials.reduce((res, social) => {
    // TODO: migrate id to twitterId https://github.com/Medialist/medialist-app/issues/253
    return social.id || res
  }, null)
  if (!twitterId) return
  var img = new Image(40, 40)
  img.onload = () => { this.firstNode.src = img.src }
  img.onerror = () => { Meteor.call('twitter/updateAvatar', twitterId) }
  img.src = this.data.avatar
})
