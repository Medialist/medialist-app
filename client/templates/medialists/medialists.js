Template.medialists.onCreated(function () {
  this.filterTerm = new ReactiveVar()
  this.subscribe('medialists')
})

Template.medialists.helpers({
  medialists: function () {
    var filterTerm = Template.instance().filterTerm.get()
    var query = {}
    if (filterTerm) {
      var filterRegExp = new RegExp(filterTerm, 'gi')
      query.$or = [
        { 'name': filterRegExp },
        { 'purpose': filterRegExp }
      ]
    }
    return Medialists.find(query, {sort: {updatedAt: -1}}).fetch()
  },
  filterTerm: function () {
    return Template.instance().filterTerm.get()
  }
})

Template.medialists.events({
  'click [data-action="create-medialist"]': function () {
    Modal.show('createMedialist')
  },
  'keyup [data-field="filter-term"]': function (evt, tpl) {
    var filterTerm = tpl.$(evt.currentTarget).val()
    Template.instance().filterTerm.set(filterTerm)
  }
})
