if (Meteor.isClient) {
  window.testLogin = function (cb) {
    cb = cb || function () {}
    Meteor.call('tests/createAndLoginTestUser', function (err, res) {
      if (err || !res) throw new Meteor.Error('cant-create-testuser')
      Meteor.connection.setUserId('AAAAAAAAAAAAAAAAA')
      cb()
    })
  }
}

if (Meteor.isServer) {
  Meteor.methods({
    'tests/createAndLoginTestUser': function () {
      Meteor.users.upsert({ _id: 'AAAAAAAAAAAAAAAAA' }, {
        _id: 'AAAAAAAAAAAAAAAAA',
        profile: { name: 'Test User'},
        services: { twitter: { profile_image_url_https: 'https://placehold.it/48x48' } }
      })
      this.setUserId('AAAAAAAAAAAAAAAAA')
      return 'AAAAAAAAAAAAAAAAA'
    },

    'tests/clearDB': function () {
      Medialists.remove({})
      Contacts.remove({})
      Posts.remove({})
      Clients.remove({})
      return true
    },

    'tests/populateDB': function (data) {
      _.each(data[0], function (medialist) {
        Medialists.insert(medialist)
      })
      _.each(data[1], function (contact) {
        Contacts.insert(contact)
      })
      _.each(data[2], function (post) {
        Posts.insert(post)
      })
      _.each(data[3], function (client) {
        Clients.insert(client)
      })
      return true
    }
  })
}
