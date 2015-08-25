Template.medialist.onCreated(function () {
  this.slug = new ReactiveVar(FlowRouter.getParam('slug'))
  this.subscribe('medialist', this.slug.get())
})

Template.medialist.helpers({
  medialist: function () {
    return Medialists.findOne({slug: Template.instance().slug.get()})
  }
})
