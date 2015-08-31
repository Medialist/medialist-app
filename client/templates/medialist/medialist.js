Template.medialist.onCreated(function () {
  var tpl = this
  tpl.slug = new ReactiveVar()
  tpl.autorun(function () {
    FlowRouter.watchPathChange()
    tpl.slug.set(FlowRouter.getParam('slug'))
  })
  tpl.autorun(function () {
    tpl.subscribe('medialist', tpl.slug.get())
  })
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
  },
  'click [data-action="show-contact-details"]': function () {
    SlideIns.show('right', 'contactDetails', { contact: this })
  }
})
