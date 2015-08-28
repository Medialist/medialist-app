Template.medialist.onCreated(function () {
  var tpl = this
  tpl.slug = new ReactiveVar()
  tpl.autorun(function () {
    FlowRouter.watchPathChange()
    tpl.slug.set(FlowRouter.getParam('slug'))
  })
  tpl.subscribe('medialist', tpl.slug.get())
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
  'click [data-action="show-contact-slide-in"]': function () {
    SlideIns.show('right', 'contactSlideIn', { contact: this })
  }
})
