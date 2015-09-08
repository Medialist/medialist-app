Modal = {
  template: new ReactiveVar(''),
  data: new ReactiveVar({}),
  open: false,
  show: function (template, data) {
    var changeTemplateAndShow = function() {
      if (data) Modal.data.set(data)
      if (template) Modal.template.set(template)
      Tracker.afterFlush(function () {
        Modal.$el.modal('show')
      })
      Modal.open = false
      Modal.$el.off('hidden.bs.modal')
      Modal.$el.on('hidden.bs.modal', function () {
        Modal.open = false
      })
    }

    if (Modal.open && Modal.template.get() !== template) {
      Modal.$el.on('hidden.bs.modal', changeTemplateAndShow)
      Modal.$el.modal('hide')
    } else {
      changeTemplateAndShow()
    }
  },
  hide: function () {
    Modal.$el.modal('hide')
  },
  onClose: function (fn) {
    check(fn, Function)
    var executeOnce = function (fn) {
      var executed = false
      return function () {
        if (!executed) {
          executed = true
          return fn()
        } else {
          Modal.$el.off('hidden.bs.modal', handler)
        }
      }
    }
    var handler = executeOnce(fn)
    Modal.$el.on('hidden.bs.modal', handler)
  }
}

Meteor.startup(function () {
  Modal.$el = $('#modal')
  Modal.$el.on('hidden.bs.modal', function () {
    Modal.open = false
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
