Template.avatar.events({
  'error img': function (evt, tpl) {
    $(evt.currentTarget).attr('src', '/images/avatar.svg')
    if (!tpl.data.socials) return /* no socials */
    var twitterId = tpl.data.socials.reduce((res, social) => {
      // TODO: migrate id to twitterId https://github.com/Medialist/medialist-app/issues/253
      return social.id || res
    }, null)
    if (!twitterId) return
    Meteor.call('twitter/updateAvatar', twitterId)
  }
})
