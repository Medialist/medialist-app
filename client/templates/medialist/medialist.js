Template.medialist.onCreated(function () {
  this.slug = new ReactiveVar(FlowRouter.getParam('slug'))
  this.subscribe('medialist', this.slug.get())
  this.subscribe('contacts')
})

Template.medialist.helpers({
  medialist: function () {
    return Medialists.findOne({slug: Template.instance().slug.get()})
  },
  contacts: function () {
    var query = {}
    query['medialists.' + Template.instance().slug.get()] = { $exists: true }
    return Contacts.find(query)
  }
})

Template.medialist.events({
  'click [data-action="add-new"]': function () {
    Modal.show('addContact')
  }
})
