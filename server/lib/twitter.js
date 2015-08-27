ServiceConfiguration.configurations.upsert(
  {
    service: 'twitter'
  },
  {
    $set: {
      consumerKey: Meteor.settings.twitter.consumer_key,
      secret: Meteor.settings.twitter.consumer_secret,
      loginStyle: 'popup'
    }
  }
)

TwitterClient = new Twitter({
  consumer_key: Meteor.settings.twitter.consumer_key,
  consumer_secret: Meteor.settings.twitter.consumer_secret,
  access_token_key: Meteor.settings.twitter.access_token_key,
  access_token_secret: Meteor.settings.twitter.access_token_secret
})

TwitterClient.grabUser = function (query, cb) {
  cb = cb || function () {}
  TwitterClient.twitter.get('users/show', query, Meteor.bindEnvironment(function (err, user) {
    if (err) {
      console.error('TwitterClient.grabUser: ', err, query)
      return cb(err)
    }
    if (!user.id_str) {
      console.log('TwitterClient.grabUser: got user with no id_str for ', query)
      return cb('User has no id_str', user)
    }
    user._id = user.id_str
    console.log('TwitterClient.grabUser: Got ' + user.screen_name, user.name)
    TwitterUsers.upsert(user._id, user)
    cb(err, user)
  }))
}

TwitterClient.grabUserByScreenName = function (screen_name, cb) {
  TwitterClient.grabUser({screen_name: screen_name}, cb)
}

TwitterClient.grabUserById = function (id, cb) {
  TwitterClient.grabUser({user_id: id}, cb)
}
