Template.editContactRoles.onCreated(function () {
  this.subscribe('contact', this.data.slug)
})

Template.editContactRoles.helpers({
  contact: function () {
    return Contacts.findOne({slug: this.slug})
  }
})
