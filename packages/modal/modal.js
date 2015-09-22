Modal = {
  template: new ReactiveVar(''),
  data: new ReactiveVar({}),
  open: false,
  show: function (template, data) {
    if (Modal.open) {
      Modal.$el.one('hidden.bs.modal', changeTemplateAndShow)
      Modal.$el.modal('hide')
    } else {
      changeTemplateAndShow()
    }
    function changeTemplateAndShow () {
      if (data) Modal.data.set(data)
      if (template) Modal.template.set(template)
      Tracker.afterFlush(function () {
        Modal.$el.modal('show')
      })
    }
  },
  hide: function () {
    Modal.$el.modal('hide')
  }
}

Meteor.startup(function () {
  Modal.$el = $('#modal')
  Modal.$el.on('hidden.bs.modal', function () {
    Modal.open = false
    Modal.template.set('')
    Modal.data.set({})
  })
  Modal.$el.on('show.bs.modal', function () {
    Modal.open = true
  })
})

Template.modal.helpers({
  template: function() {
    return Modal.template.get()
  },
  data: function() {
    return Modal.data.get()
  }
})

Template.modal.events({
  'click [data-action="hide-modal"]': function () {
    Modal.$el.hide()
  }
})
