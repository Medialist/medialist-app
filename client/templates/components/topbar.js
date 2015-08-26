Template.topbar.helpers({
  breadcrumbs: function () {
    return App.breadcrumbs.get()
  }
})

Template.topbar.events({
  'click [data-action="show-slide-in-menu"]': function () {
    SlideIns.show('left', 'mainmenu')
  },
  'click [data-action="create-medialist"]': function () {
    Modal.show('createMedialist')
  }
})
