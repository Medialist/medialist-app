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
  var faker = Npm.require('faker')

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
      Orgs.remove({})
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
      _.each(data[4], function (orgs) {
        Orgs.insert(orgs)
      })
      return true
    },

    'tests/makeMedialists': function (n) {
      Array(n).fill(0).forEach(() => {
        Meteor.call('medialists/create', {
          name: faker.commerce.productName(),
          client: {
            name: faker.company.companyName()
          },
          purpose: faker.lorem.sentence()
        })
      })
    },

    'tests/makeContacts': function (n) {
      var medialists = Medialists.find().map(medialist => medialist.slug)
      Array(n).fill(0).forEach(() => {
        Meteor.call('contacts/create', {
          screenName: faker.internet.domainWord(),
          name: faker.name.findName(),
          bio: faker.lorem.sentence()
        }, _.sample(medialists))
      })
    },

    'tests/makePosts': function (n) {
      var contacts = Contacts.find().fetch()
      var statuses = _.values(Contacts.status)
      Array(n).fill(0).forEach(() => {
        var contact = _.sample(contacts)
        if (!contact.medialists.length) return console.log('Skipping contact with no medialists')
        Meteor.call('posts/create', {
          contactSlug: contact.slug,
          medialistSlug: _.sample(contact.medialists),
          message: faker.lorem.sentence(),
          status: _.sample(statuses)
        })
      })
    }
  })
}
