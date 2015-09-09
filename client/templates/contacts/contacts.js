Template.contacts.onCreated(function () {
  this.subscribe('contacts', {limit: 100})
})

Template.contacts.helpers({
  allContacts: function () {
    return Contacts.find({}, {sort: {'roles.[0].org': 1}})
  }
})

Template.contacts.events({
  'click [data-action="add-new"]': function () {
    Modal.show('addContact')
  }
})