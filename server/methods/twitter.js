var Future = Npm.require('fibers/future')

Meteor.methods({
  'twitter/grabUserByScreenName': function (screenName) {
    var fut = new Future()
    check(screenName, String)
    if (!this.userId) throw new Meteor.Error('Only logged in users can search by screenname')
    TwitterClient.grabUserByScreenName(screenName, function (err, res) {
      if (err) throw new Meteor.Error(err)
      fut.return(res)
    })
    return fut.wait()
  }
})
