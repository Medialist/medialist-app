Medialists = new Mongo.Collection('medialists');

if (Meteor.isServer) {
  Medialists._ensureIndex({
    'slug': 1
  })
}

Medialists.deny({
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

Schemas.Medialists = new SimpleSchema({
  createdBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  createdAt: {
    type: Date
  },
  updatedBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  updatedAt: {
    type: Date
  },
  name: {
    type: String,
    min: 1
  },
  purpose: {
    type: String,
    min: 1
  },
  slug: {
    type: String,
  },
  contacts: {
    type: [String]
  }
})
