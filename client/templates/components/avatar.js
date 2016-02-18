Template.avatar.helpers({
  twitterId: function () {
    if (!this.socials) return
    return this.socials.reduce((res, social) => {
      // TODO: migrate id to twitterId https://github.com/Medialist/medialist-app/issues/253
      return social.id || res
    }, null)
  }
})
