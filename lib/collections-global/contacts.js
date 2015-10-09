Contacts = new Mongo.Collection('contacts', {
  transform: function (contact) {
    contact.createdAt = moment(contact.createdAt)
    return contact
  }
});

if (Meteor.isServer) {
  Contacts._ensureIndex({
    'slug': 1
  })
}

Contacts.deny({
  insert: function (userId, doc) {
    return true;
  },

  update: function (userId, doc, fieldNames, modifier) {
    return true;
  },

  remove: function (userId, doc) {
    return true;
  }
});

Contacts.status = {
  completed: 'Completed',
  hotLead: 'Hot Lead',
  contacted: 'Contacted',
  toContact: 'To Contact',
  notInterested: 'Not Interested'
}
Contacts.phoneTypes = [
  'mobile',
  'landline'
]

// Get the index of a given status for sorting
// String => Integer
Contacts.statusIndex = [].indexOf.bind(_.values(Contacts.status))

Schemas.Phones = new SimpleSchema({
  number: {
    type: String
  },
  type: {
    type: String,
    allowedValues: Contacts.phoneTypes
  }
})

Schemas.Roles = new SimpleSchema({
  title: {
    label: 'Title',
    type: String,
    defaultValue: ''
  },
  'org.name': {
    label: 'Organisation',
    type: String,
    min: 1
  },
  'org._id': {
    label: 'Org id',
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true
  },
  phones: {
    type: [Schemas.Phones],
    defaultValue: []
  }
})

Schemas.Twitter = new SimpleSchema({
  screenName: {
    type: String,
    optional: true
  },
  id: {
    type: String,
    optional: true
  }
})

Schemas.Contacts = new SimpleSchema({
  'createdBy._id': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'createdBy.name': {
    type: String
  },
  createdAt: {
    type: Date
  },
  medialists: {
    type: [String]
  },
  name: {
    type: String,
    min: 1
  },
  avatar: {
    type: String,
    optional: true
  },
  twitter: {
    type: Schemas.Twitter
  },
  'roles.$.title': {
    label: 'Title',
    type: String,
    defaultValue: ''
  },
  'roles.$.org.name': {
    label: 'Organisation',
    type: String,
    min: 1
  },
  'roles.$.org._id': {
    label: 'Org id',
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'roles.$.email': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true
  },
  'roles.$.phones.$.number': {
    type: String
  },
  'roles.$.phones.$.type': {
    type: String,
    allowedValues: Contacts.phoneTypes
  },
  bio: {
    type: String,
    optional: true
  },
  slug: {
    type: String
  }
})
