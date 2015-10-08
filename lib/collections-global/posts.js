Posts = new Mongo.Collection('posts', {
  transform: function (post) {
    post.createdAt = moment(post.createdAt)
    return post
  }
});

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

Schemas.PostContacts = new SimpleSchema({
  'slug': {
    type: String
  },
  'name': {
    type: String
  }
})

Schemas.Posts = new SimpleSchema({
  'createdBy._id': {
    type: String,
  },
  'createdBy.name': {
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
    type: [Schemas.PostContacts],
    minCount: 1
  },
  medialists: {
    type: [String],
    minCount: 0
  },
  status: {
    type: String,
    allowedValues: _.values(Contacts.status),
    optional: true
  },
  type: {
    type: String,
    allowedValues: [
      'feedback',
      'need to know',
      'details changed'
    ],
    optional: true
  },
  details: {
    type: Object,
    blackbox: true,
    optional: true
  }
})
