exports.command = function() {
  var client = this
  client
    .timeoutsAsyncScript(5000)
    .executeAsync(function(cb) {
      window.testLogin(function () {
        cb(Meteor.userId())
      })
    }, function(response) {
      client.assert.equal(response.value, 'AAAAAAAAAAAAAAAAA', 'Test user is logged in')
    })

  return client
};
