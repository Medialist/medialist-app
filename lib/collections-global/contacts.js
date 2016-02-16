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
  'createdBy.avatar': {
    type: String
  },
  createdAt: {
    type: Date
  },
  'updatedBy._id': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'updatedBy.name': {
    type: String
  },
  'updatedBy.avatar': {
    type: String
  },
  updatedAt: {
    type: Date
  },
  medialists: {
    type: [String]
  },
  // Concatenate data supplied by Gorkana as { firstName, lastName }
  name: {
    type: String,
    min: 1
  },
  avatar: {
    type: String,
    optional: true
  },
  // We are currently storing screenName and twitter id; this will be screenName as we don't appear to be using the latter anywhere.  It's not practical to store this as a URL though.
  'socials.$.label': {
    type: String
  },
  'socials.$.value': {
    type: String
  },
  'socials.$.id': {
    type: String,
    optional: true
  },
  // etc...
  primaryOutlets: {
    type: String
  },
  otherOutlets: {
    type: String,
    optional: true
  },
  sectors: {
    type: String
  },
  jobTitle: {
    type: String
  },
  languages: {
    type: [String],
    min: 1
  },
  // Do we concatenate addresses?
  address: {
    type: String,
    optional: true
  },
  'emails.$.label': {
    type: String,
  },
  'emails.$.value': {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  'phones.$.value': {
    type: String
  },
  'phones.$.label': {
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

Contacts.fieldNames = {
  'name': 'name',
  'roles.0.title': 'title',
  'roles.0.org.name': 'organisation',
  'twitter.screenName': 'twitter handle',
  'roles.0.email': 'email',
  'roles.0.phones.0.number': 'phone number'
}
