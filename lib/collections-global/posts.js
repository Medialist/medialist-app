Posts = new Mongo.Collection('posts');

Posts.deny({
  insert: function (userId, doc) {
    return true
  },

  update: function (userId, doc, fieldNames, modifier) {
    return true
  },

  remove: function (userId, doc) {
    return true
  }
})

Schemas.Posts = new SimpleSchema({
  'createdBy._id': {
    type: String,
  },
  'createdBy_name': {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  message: {
    type: String,
    optional: true
  },
  contacts: {
    type: [String],
    minCount: 1
  },
  medialists: {
    type: [String],
    minCount: 1
  },
  status: {
    type: String,
    allowedValues: _.values(Contacts.status)
  }
})
