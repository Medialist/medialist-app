var phoneType = new ReactiveVar('mobile')

Template.editContactRoles.onCreated(function () {
  this.subscribe('contact', this.data.slug)
})

Template.editContactRoles.helpers({
  contact: function () {
    return Contacts.findOne({slug: this.slug})
  },
  phoneType: function () {
    return phoneType.get()
  }
})

Template.editContactRoles.events({
  'click [data-action=toggle-phone-type]': function () {
    if (phoneType.get() === 'mobile') {
      phoneType.set('landline')
    } else {
      phoneType.set('mobile')
    }
  },
  'submit': function (evt, tpl) {
    evt.preventDefault()

    var fields = ['org', 'title', 'email']
    var role = fields.reduce(function (role, field) {
      var value = tpl.$('#contact-role-' + field).val()
      if (value) role[field] = value
      return role
    }, {})
    var number = tpl.$('#contact-role-number').val()
    if (number) {
      role.phones = [{
        number: number,
        type: phoneType.get()
      }]
    } else {
      role.phones = []
    }

    Meteor.call('contacts/addRole', tpl.data.slug, role, function (err) {
      if (err) return console.error(err)
      Modal.hide()
    })
  }
})
