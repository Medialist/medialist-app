Contacts = new Mongo.Collection('contacts');

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
  toContact: 'to contact',
  contacted: 'contacted',
  notInterested: 'not interested',
  hotLead: 'hot lead',
  completed: 'completed'
}

Schemas.Jobs = new SimpleSchema({
  title: {
    type: String,
  },
  org: {
    type: String
  }
})

Schemas.Emails = new SimpleSchema({
  address: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  type: {
    type: String
  }
})

Schemas.Phones = new SimpleSchema({
  number: {
    type: String
  },
  type: {
    type: String
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
  name: {
    type: String,
    min: 1
  },
  avatar: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  twitter: {
    type: String,
    optional: true
  },
  jobs: {
    type: [Schemas.Jobs]
  },
  bio: {
    type: String,
    optional: true
  },
  emails: {
    type: [Schemas.Emails]
  },
  phones: {
    type: [Schemas.Phones]
  },
  slug: {
    type: String
  },
  medialists: {
    type: Object,
    blackbox: true
  }
})
