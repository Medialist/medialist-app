Template.topbar.helpers({
  breadcrumbs: function () {
    return App.breadcrumbs.get()
  },
  active: function (name) {
    return FlowRouter.getRouteName() === name ? 'active' : ''
  },
  isActive: function (name) {
    return FlowRouter.getRouteName() === name
  }
})

Template.topbar.events({
  'click [data-action="toggle-mainmenu"]': function () {
    SlideIns.toggle('left', 'mainmenu')
  },
  'click [data-action="create-medialist"]': function () {
    Modal.show('createMedialist')
  }
})
