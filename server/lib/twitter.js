ServiceConfiguration.configurations.upsert(
  { service: 'twitter' },
  { $set: {
    consumerKey: Meteor.settings.twitter.consumer_key,
    secret: Meteor.settings.twitter.consumer_secret,
    loginStyle: "popup"
  }
  }
)
