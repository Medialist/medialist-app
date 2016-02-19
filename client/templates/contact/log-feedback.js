Template.logFeedback.onCreated(function () {
  var medialist = Medialists.findOne({ slug: FlowRouter.getParam('slug') })
  var contact = Template.currentData().contact
  this.status = new ReactiveVar(medialist && medialist.contacts[contact.slug])
  this.active = new ReactiveVar(false)
  this.medialistSlug = new ReactiveVar(FlowRouter.getParam('slug'))

  this.autorun(() => {
    FlowRouter.watchPathChange()
    medialist = Medialists.findOne({ slug: FlowRouter.getParam('slug') })
    contact = Template.currentData().contact
    if (!medialist || !contact) return
    this.status.set(medialist.contacts[contact.slug])
    this.medialistSlug.set(FlowRouter.getParam('slug'))
  })
})

Template.logFeedback.helpers({
  'active': function () {
    var tpl = Template.instance()
    return tpl.active.get()
  },
  'status': function () {
    var tpl = Template.instance()
    return tpl.status.get()
  },
  'medialistSlug': function () {
    var tpl = Template.instance()
    return tpl.medialistSlug.get()
  },
  'medialists': function () {
    return Medialists.find({}, {limit: 10, sort: {updatedAt: -1}, fields: {slug: 1} }).fetch()
  }
})

Template.logFeedback.events({
  'click': function (evt, tpl) {
    tpl.active.set(true)
  },
  'click [data-action="set-status"]': function (evt, tpl) {
    tpl.status.set(this.valueOf())
  },
  'click [data-action="set-medialist"]': function (evt, tpl) {
    tpl.medialistSlug.set(this.slug)
  },
  'click [data-action="save"]': function (evt, tpl) {
    var $input = tpl.$('.feedback-input')
    var message = App.cleanFeedback($input.text())
    if (!message) return
    var data = {
      message: message,
      status: tpl.status.get(),
      contactSlug: tpl.data.contact.slug,
      medialistSlug: tpl.medialistSlug.get()
    }
    console.log('Feedback', data)
    Meteor.call('posts/create', data, function (err) {
      if (err) return console.error(err) // TODO: snackbar
      $input.text('')
      $('.contact-activity-log').perfectScrollbar('update')
    })
  }
})
