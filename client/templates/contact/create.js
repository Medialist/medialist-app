Template.createContact.onCreated(function () {
  var tpl = this
  tpl.screenName = ''
  tpl.getTwitterDetails = _.debounce(function () {
    Meteor.call('twitter/grabUserByScreenName', tpl.screenName, function (err, res) {
      if (err) return console.error(err)
      if (!tpl.$('#contact-create-name').val()) {
        tpl.$('#contact-create-name').val(res.name)
      }
      if (!tpl.$('#contact-create-bio').val()) {
        tpl.$('#contact-create-bio').val(res.description)
      }
      tpl.$('#contact-create-avatar').attr('src', res.profile_image_url_https)
    })
  }, 1000)
})

Template.createContact.onRendered(function () {
  var tpl = this
  if (tpl.data.screenName) {
    tpl.screenName = tpl.data.screenName
    tpl.getTwitterDetails()
  }
})

Template.createContact.events({
  'change #contact-create-screenName': function (evt, tpl) {
    tpl.screenName = tpl.$(evt.currentTarget).val()
    tpl.getTwitterDetails()
  },

  'submit': function (evt, tpl) {
    evt.preventDefault()

    var fields = ['name', 'screenName', 'bio']
    var contact = fields.reduce(function (contact, field) {
      var value = tpl.$('#contact-create-' + field).val()
      if (value) contact[field] = value
      return contact
    }, {})

    Meteor.call('contacts/create', contact, tpl.data.medialist, function (err, contact) {
      if (err) return console.error(err)
      Modal.show('editContactRoles', {slug: contact.slug})
    })
  }
})