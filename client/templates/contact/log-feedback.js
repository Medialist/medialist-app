Template.logFeedback.onCreated(function () {
  this.active = new ReactiveVar(false)
  var medialist = Medialists.findOne({ slug: FlowRouter.getParam('slug') })
  this.status = new ReactiveVar(medialist && medialist.contacts[Template.currentData().contact.slug])
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
  }
})