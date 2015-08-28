Template.medialists.helpers({
  medialists: function () {
    return Medialists.find({}).fetch()
  }
})
