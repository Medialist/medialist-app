Template.logFeedback.onCreated(function () {
  var medialist = Medialists.findOne({ slug: FlowRouter.getParam('slug') })
  var contact = Template.currentData().contact
  this.active = new ReactiveVar(false)
  this.medialist = new ReactiveVar(medialist)
  this.status = new ReactiveVar(medialist && medialist.contacts[contact.slug])
  this.contact = new ReactiveVar(contact)
})

Template.logFeedback.helpers({
  'active': function () {
    var tpl = Template.instance()
    return tpl.active.get()
  },
  'status': function () {
    var tpl = Template.instance()
    return tpl.status.get()
  }
})

Template.logFeedback.events({
  'click': function (evt, tpl) {
    tpl.active.set(true)
  },
  'click [data-action="set-status"]': function (evt, tpl) {
    tpl.status.set(this.valueOf())
  },
  'click [data-action="save"]': function (evt, tpl) {
    var $input = tpl.$('.feedback-input')
    var message = App.cleanFeedback($input.text())
    if (!message) return
    var data = {
      message: message,
      status: tpl.status.get(),
      contactSlug: tpl.contact.get().slug,
      medialistSlug: tpl.medialist.get().slug,
    }
    console.log('Feedback', data)
    Meteor.call('posts/create', data, function (err) {
      if (err) return console.error(err) // TODO: snackbar
      $input.text('')
      $('.contact-activity-log').perfectScrollbar('update')
    })
  }
})
