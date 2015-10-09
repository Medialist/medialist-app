var Migrations = new Mongo.Collection('tableflip_migrations')

var MigrationVersions = [
  {
    number: 1,
    instructions () {
      // Contacts migration
      Contacts.find().forEach(contact => {
        _.forEach(contact.roles, role => {
          if (typeof role.org !== 'string') return
          var orgName = role.org
          role.org = { name: orgName }
          var org = Orgs.findOne({ name: role.org.name })
          if (org) {
           role.org._id = org._id
          } else {
           role.org._id = Orgs.insert({ name: role.org.name })
          }
        })
        Contacts.update(contact._id, contact)
      })
    }
  },

  {
    number: 2,
    instructions () {
      // Contacts migration
      Contacts.find().forEach(contact => {
        if (typeof contact.createdBy !== 'string') return
        var newCreatedBy = { _id: contact.createdBy }
        var user = Meteor.users.findOne(contact.createdBy)
        newCreatedBy.name = user.profile.name
        contact.createdBy = newCreatedBy
        Contacts.update(contact._id, contact)
      })
    }
  },

  {
    number: 3,
    instructions () {
      // Contacts migration
      Posts.find().forEach(post => {
        var newContacts = post.contacts.reduce((memo, contact) => {
          if (typeof contact !== 'string') {
            memo.push(contact)
            return memo
          }
          var contactObj = Contacts.findOne({ slug: contact })
          if (!contactObj) return memo
          memo.push({
            slug: contactObj.slug,
            name: contactObj.name
          })
          return memo
        }, [])
        post.contacts = newContacts
        Posts.update(post._id, post)
      })
    }
  },

  {
    number: 4,
    instructions () {
      // Posts migration
      Posts.find().forEach(post => {
        if (!post.type) {
          post.type = 'feedback'
          Posts.update(post._id, post)
        }
      })
    }
  },

  {
    number: 5,
    instructions () {
      // Orgs migration
      Contacts.find().forEach(contact => {
        contact.roles.forEach(role => {
          if (typeof role.org === 'string') {
            var org = Orgs.findOne({ name: role.org })
            var newRole = { name: role.org }
            if (org) {
             newRole._id = org._id
            } else {
             newRole._id = Orgs.insert({ name: role.org })
            }
            role.org = newRole
            Contacts.update(contact._id, contact)
          }
        })
      })
    }
  },

  {
    number: 6,
    instructions () {
      // Clients migration
      Medialists.find().forEach(medialist => {
        if (typeof medialist.client === 'string') {
          var client = Clients.findOne({ name: medialist.client })
          var newClient = { name: medialist.client }
          if (client) {
           newClient._id = client._id
          } else {
           newClient._id = Clients.insert({ name: medialist.client })
          }
          medialist.client = newClient
          Medialists.update(medialist._id, medialist)
        }
      })
    }
  }
]

Meteor.methods({
  'migrations/run': function () {
    checkMigrator(this.userId)
    var migrationsRun = []
    MigrationVersions.forEach(migration => {
      if (Migrations.find({ version: migration.number }).count()) return
      if (migration.instructions) migration.instructions()
      Migrations.insert({ version: migration.number })
      migrationsRun.push(migration.number)
    })
    if (migrationsRun.length) {
      console.log(`Successfully ran ${migrationsRun.length} migrations: `, migrationsRun.map(v => `v${v}`))
    } else {
      console.log('No unprocessed migrations found to run.')
    }
    return migrationsRun
  },
  'migrations/check': function () {
    console.log('Checking docs...')
    var failedDocs = []
    ;['Orgs', 'Clients', 'Contacts', 'Medialists', 'Posts'].forEach(collection => {
      var Collection = global[collection]
      var validator = Schemas[collection].namedContext('validator');
      Collection.find().forEach(doc => {
        if (!validator.validate(_.omit(doc, '_id'))) {
          var invalidKeys = validator.invalidKeys()
          invalidKeys = invalidKeys.reduce(function (newInvalidKeys, key) {
            if (key.type !== 'expectedConstructor' || typeof key.value !== 'object' || !key.value._isAMomentObject) {
              newInvalidKeys.push(key)
            }
            return newInvalidKeys
          }, [])
          if (!invalidKeys.length) return
          console.log(collection, invalidKeys)
          failedDocs.push({
            collection,
            doc: doc._id,
            invalidKeys: invalidKeys
          })
        }
      })
    })
    console.log('Finished running checks')
    return failedDocs
  }
})

function checkMigrator(userId) {
  if (!userId) throw new Meteor.Error('Only a logged-in user can run migrations')
  var user = Meteor.users.findOne(userId)
  var whitelist = Meteor.settings && Meteor.settings.migrations.whitelist
  if (whitelist.indexOf(user.services.twitter.screenName) === -1) throw new Meteor.Error('Only a whitelisted user can run migrations')
}
