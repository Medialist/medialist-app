var error = new ReactiveVar()

Template.createMedialist.helpers({
  error: function () {
    return error.get()
  }
})

Template.createMedialist.events({
  'submit': function (evt, tpl) {
    evt.preventDefault()

    var medialist = {
      name: tpl.$('#medialist-name').val(),
      purpose: tpl.$('#medialist-purpose').val()
    }

    tpl.$('#addMedialist').get(0).reset()

    Meteor.call('medialists/create', medialist, function (err) {
      if (err) return error.set(err.reason)
      Modal.hide()
      FlowRouter.go('medialist', { slug: medialist.name })
      FlowRouter.reload()
    })
  }
})
