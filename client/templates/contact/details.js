var contactSection = new ReactiveVar('contactDetails')

Template.contactSlideIn.helpers({
  contactSection: function () {
    return contactSection.get()
  }
})

Template.contactSlideIn.events({
  'click [data-action="close-contact-slide-in"]': function () {
    SlideIns.hide('right')
  },
  'click [data-section]': function (evt, tpl) {
    var section = tpl.$(evt.currentTarget).data('section')
    contactSection.set(section)
  }
})
