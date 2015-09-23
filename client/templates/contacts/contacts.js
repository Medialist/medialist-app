Template.contacts.onCreated(function () {
  this.filterTerm = new ReactiveVar()
  this.subscribe('contacts', {limit: 100})
})

Template.contacts.helpers({
  allContacts: function () {
    var filterTerm = Template.instance().filterTerm.get()
    var query = {}
    if (filterTerm) {
      var filterRegExp = new RegExp(filterTerm, 'gi')
      query.$or = [
        { 'name': filterRegExp },
        { 'roles.0.title': filterRegExp },
        { 'roles.0.org': filterRegExp }
      ]
    }
    return Contacts.find(query, {sort: {'roles.[0].org': 1}})
  },
  filterTerm: function () {
    return Template.instance().filterTerm.get()
  }
})

Template.contacts.events({
  'click [data-action="add-new"]': function () {
    Modal.show('addContact')
  },
  'keyup [data-field="filter-term"]': function (evt, tpl) {
    var filterTerm = tpl.$(evt.currentTarget).val()
    Template.instance().filterTerm.set(filterTerm)
  }
})
