Template.medialistSlideIn.onCreated(function () {
  var tpl = this
  tpl.section = new ReactiveVar('medialistDetails')
})

Template.medialistSlideIn.helpers({
  medialistDetails () {
    return Medialists.findOne({ slug: this.medialist })
  }
})

Template.medialistSlideIn.events({
  'click [data-section]': function (evt, tpl) {
    var section = tpl.$(evt.currentTarget).data('section')
    tpl.section.set(section)
  },
})
