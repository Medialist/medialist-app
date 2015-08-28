Contacts = new Mongo.Collection('contacts');

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
  toContact: 'To Contact',
  contacted: 'Contacted',
  notInterested: 'Not Interested',
  hotLead: 'Hot Lead',
  completed: 'Completed'
}

Schemas.Phones = new SimpleSchema({
  number: {
    type: String
  },
  type: {
    type: String,
    allowedValues: [
      'mobile',
      'landline'
    ]
  }
})

Schemas.Roles = new SimpleSchema({
  title: {
    type: String,
    defaultValue: ''
  },
  org: {
    type: String,
    defaultValue: ''
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
  createdBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  createdAt: {
    type: Date
  },
  medialists: {
    type: Object,
    blackbox: true
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
  roles: {
    type: [Schemas.Role]
  },
  bio: {
    type: String,
    optional: true
  },
  slug: {
    type: String
  }
})
