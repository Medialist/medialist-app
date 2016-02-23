Template.medialists.onCreated(function () {
  var tpl = this
  tpl.filterTerm = new ReactiveVar()
  tpl.checkSelect = new ReactiveVar({})
  tpl.query = new ReactiveVar({})
  tpl.autorun(() => {
    var filterTerm = Template.instance().filterTerm.get()
    var query = {}
    if (filterTerm) {
      var filterRegExp = new RegExp(filterTerm, 'gi')
      query.$or = [
        { 'name': filterRegExp },
        { 'purpose': filterRegExp },
        { 'client.name': filterRegExp }
      ]
    }
    tpl.query.set(query)
  })
  tpl.subscribe('medialists')

  tpl.autorun(() => {
    FlowRouter.watchPathChange()
    if (!tpl.subscriptionsReady()) return
    var medialistSlug = FlowRouter.getQueryParam('medialist')
    if (Medialists.find({ slug: medialistSlug }).count()) {
      SlideIns.show('right', 'medialistSlideIn', { medialist: medialistSlug })
      Meteor.setTimeout(() => {
        var medialistRow = tpl.$(`[data-medialist="${medialistSlug}"]`)
        if (!medialistRow.visible()) $.scrollTo(medialistRow, { offset: -250 })
      }, 1)
    } else {
      SlideIns.hide('right')
    }
  })
})

Template.medialists.onRendered(function () {
  this.tablesort = MeteorTablesort('.medialist-table', () => {
    Medialists.find(this.query.get()).fetch()
  })
})

Template.medialists.helpers({
  medialists: function () {
    return Medialists.find(Template.instance().query.get(), {sort: {updatedAt: -1}}).fetch()
  },
  filterTerm: function () {
    return Template.instance().filterTerm.get()
  },
  checkSelectKeys: function () {
    return Object.keys(Template.instance().checkSelect.get())
  },
  checked: function () {
    return this.slug in Template.instance().checkSelect.get()
  }
})

Template.medialists.events({
  'click [data-action="create-medialist"]': function () {
    FlowRouter.setQueryParams({ contact: null, medialist: null })
    Modal.show('createMedialist')
  },
  'keyup [data-field="filter-term"]': function (evt, tpl) {
    var filterTerm = tpl.$(evt.currentTarget).val()
    Template.instance().filterTerm.set(filterTerm)
  },
  'click [data-checkbox-all]': function (evt, tpl) {
    var checked = tpl.$(evt.currentTarget).prop('checked')
    if (checked) {
      tpl.checkSelect.set(_.reduce(Medialists.find(tpl.query.get()).fetch(), function (newCheckSelect, contact) {
        newCheckSelect[contact.slug] = true
        return newCheckSelect
      }, {}))
    } else {
      tpl.checkSelect.set({})
    }
  },
  'click [data-checkbox]': function (evt, tpl) {
    App.toggleReactiveObject(tpl.checkSelect, this.slug)
    if(!$(evt.currentTarget).prop('checked')) $('[data-checkbox-all]').prop('checked', false)
  },
  'click [data-action="show-medialist-details"]': function (evt) {
    if (evt.target.tagName === 'A') return SlideIns.hide('right')
    FlowRouter.setQueryParams({ medialist: this.slug })
  },
})
