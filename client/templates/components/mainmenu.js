Template.mainmenu.events({
  'click [data-action="hide-mainmenu"]': function () {
    SlideIns.hide('left')
  }
})

Template.mainmenu.helpers({
  medialists: function () {
    return Medialists.find({}, {limit: 5, sort: {updatedAt: -1}}).fetch()
  }
})
