Clients = new Mongo.Collection('clients')

Clients.allow({
  insert: function () {
    return false
  },

  update: function () {
    return false
  },

  remove: function () {
    return false
  }
})
