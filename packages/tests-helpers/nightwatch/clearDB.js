exports.command = function() {
  var client = this
  client
    .timeoutsAsyncScript(5000)
    .executeAsync(function (cb) {
      Meteor.call('tests/clearDB', function(err, res) {
        if (err) throw new Error(err)
        cb(res)
      })
    }, function (result) {
      client.assert.equal(result.value, true, 'Database cleared')
    }).pause(1000)
    return client
}
