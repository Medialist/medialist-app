var filterState = new ReactiveVar()

Template.filterButton.helpers({
  filter: function () {
    return filterState.get()
  }
})

Template.filterButton.events({
  'click [data-filter]': function (evt, tpl) {
    var filter = tpl.$(evt.currentTarget).data('filter')
    filterState.set(filter)
  },
})
