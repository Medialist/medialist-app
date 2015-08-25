Template.medialist.onCreated(function () {
  this.slug = new ReactiveVar(FlowRouter.getParam('slug'))
  this.subscribe('medialist', this.slug.get())
})
