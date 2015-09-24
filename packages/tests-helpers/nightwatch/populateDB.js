var medialists = require('../fixtures/medialists.json')
var contacts = require('../fixtures/contacts.json')
var posts = require('../fixtures/posts.json')
var orgs = require('../fixtures/orgs.json')

exports.command = function() {
  var client = this
  client
    .timeoutsAsyncScript(5000)
    .executeAsync(function (data, cb) {
      Meteor.call('tests/populateDB', data, function(err, res) {
        if (err) throw new Error(err)
        cb(res)
      })
    }, [[medialists, contacts, posts, orgs]], function (result) {
      client.assert.equal(result.value, true, 'Database populated')
    }).pause(1000)
    return client
}
