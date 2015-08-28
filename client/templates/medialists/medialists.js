Template.medialists.helpers({
  medialists: function () {
    return Medialists.find({}).fetch()
  }
})

Template.medialists.events({
  'click [data-action="create-medialist"]': function () {
    Modal.show('createMedialist')
  }
})