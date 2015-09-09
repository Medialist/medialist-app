Template.medialists.onCreated(function () {
  this.subscribe('medialists')
})

Template.medialists.helpers({
  medialists: function () {
    return Medialists.find({}, {sort: {updatedAt: -1}}).fetch()
  }
})

Template.medialists.events({
  'click [data-action="create-medialist"]': function () {
    Modal.show('createMedialist')
  }
})
