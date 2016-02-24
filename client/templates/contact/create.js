Template.createContact.onCreated(function () {
  var tpl = this
  tpl.screenName = ''
  tpl.queryingTwitter = new ReactiveVar(false)
  tpl.twit = ReactiveVar({profile_image_url_https: '/images/avatar.svg'})
  tpl.getTwitterDetails = _.debounce(function () {
    tpl.queryingTwitter.set(true)
    Meteor.call('twitter/grabUserByScreenName', tpl.screenName, function (err, res) {
      tpl.queryingTwitter.set(false)
      if (err) return console.error(err)
      tpl.twit.set(res)
    })
  }, 1000, true)
})

Template.createContact.onRendered(function () {
  var tpl = this
  if (tpl.data.screenName) {
    tpl.screenName = tpl.data.screenName
    tpl.getTwitterDetails()
  }
})

Template.createContact.helpers({
  queryingTwitter: function () {
    var tpl = Template.instance()
    return tpl.queryingTwitter.get()
  },
  twit: function () {
    var tpl = Template.instance()
    return tpl.twit.get()
  }
})

Template.createContact.events({
  'change #contact-twitter': function (evt, tpl) {
    tpl.screenName = tpl.$(evt.currentTarget).val()
    tpl.getTwitterDetails()
  },

  'submit': function (evt, tpl) {
    evt.preventDefault()
    var fields = ['name', 'twitter', 'primaryOutlets', 'jobTitles', 'email', 'phone']
    var contact = fields.reduce(function (contact, field) {
      var value = tpl.$('#contact-' + field).val()
      if (value && field === 'screenName') contact[field] = value.replace('@', '')
      else if (value) contact[field] = value
      return contact
    }, {})
    Meteor.call('contacts/create', contact, tpl.data.medialist, function (err, contact) {
      if (err) return console.error(err)
      FlowRouter.setQueryParams({ contact: contact.slug, medialist: null })
      Modal.hide()
    })
  }
})
