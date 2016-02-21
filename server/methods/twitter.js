var Future = Npm.require('fibers/future')

Meteor.methods({
  'twitter/grabUserByScreenName': function (screenName) {
    var fut = new Future()
    check(screenName, String)
    if (!this.userId) throw new Meteor.Error('Only logged in users can search by screenname')
    TwitterClient.grabUserByScreenName(screenName, function (err, res) {
      if (err) return fut.throw(new Meteor.Error('bad-twitter-handle', 'Twitter API does not recognise that handle', err))
      fut.return(res)
    })
    return fut.wait()
  },

  // The client is just letting us know there is some work to do, they don't care about the response.
  'twitter/updateAvatar': function (twitterId) {
    if (!this.userId) throw new Meteor.Error('Only logged in users can request twitter updates')
    check(twitterId, String)
    // Can we still see their avatar?
    var twit = TwitterUsers.findOne({_id: twitterId}, {fields: {'profile_image_url_https': 1}})
    HTTP.get(twit.profile_image_url_https, err => {
      if (!err) return // avatar is fine. ignore.
      TwitterClient.grabUserById(twitterId, err => { if (err) console.log(err) })
    })
  }
})
