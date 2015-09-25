Medialists = new Mongo.Collection('medialists', {
  transform: function (medialist) {
    medialist.createdAt = moment(medialist.createdAt)
    medialist.updatedAt = moment(medialist.updatedAt)
    return medialist
  }
});

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
  'updatedBy._id': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'updatedBy.name': {
    type: String
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
    type: Object,
    blackbox: true
  },
  'client._id': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'client.name': {
    type: String,
    min: 1
  },
})
