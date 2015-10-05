Meteor.methods({
  'migrations/contacts/0-1': function () {
    checkMigrator(this.userId)
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
    return true
  }
})

function checkMigrator(userId) {
  if (!userId) throw new Meteor.Error('Only a logged-in user can run migrations')
  var user = Meteor.users.findOne(userId)
  var whitelist = Meteor.settings && Meteor.settings.migrations.whitelist
  if (whitelist.indexOf(user.services.twitter.screenName) === -1) throw new Meteor.Error('Only a whitelisted user can run migrations')
}
