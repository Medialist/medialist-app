// add tests to this file using the Nightwatch.js API
// http://nightwatchjs.org/api

module.exports = {
  'Login and show menu': function (client) {
    client
      .url('http://localhost:3000')
      .clearDB()
      .populateDB()
      .login()
      .verify.elementPresent('body', 'Page loads successfully')
      .click('[data-action="toggle-mainmenu"]')
      .expect.element('.mainmenu').to.be.visible.before(1000)
    },

  'Select and show Medialist': function (client) {
    client
      .click('a[href="/medialist/medialist1"]')
      .click('[data-action="toggle-mainmenu"]')
    client
      .expect.element('.medialist-breadcrumbs li:last-child a').text.to.equal('#medialist1').before(1000)
    client
      .expect.element('.medialist-purpose p').text.to.equal('A Medialist')
    client
      .expect.element('.contact-row').to.be.present
  },

  'Create Medialist': function (client) {
    var medialistName = 'test-medialist'
    var medialistPurpose = 'Test Medialist Purpose'
    client
      .click('[data-action="create-medialist"]')
      .waitForElementVisible('.modal-body', 1000)
      .setValue('#medialist-name', medialistName)
      .setValue('#medialist-purpose', medialistPurpose)
      .submitForm('#addMedialist')
      .pause(1000)
    client
      .expect.element('.medialist-breadcrumbs li:last-child a').text.to.equal('#' + medialistName).before(1000)
  },

  'Add Contact': function (client) {
    client
      .click('[data-action="add-new"]')
      .waitForElementVisible('.modal-body', 1000)
      .getText('.modal-body .media:nth-of-type(2) .media-body h5', function (name) {
        client
          .click('.modal-body .media:nth-of-type(2) [data-action="add-contact"]')
          .click('[data-dismiss="modal"]')
        client
          .expect.element('.contact-row').to.be.present.before(1000)
        client
          .expect.element('.col-name').text.to.equal(name.value).before(1000)
      })
  },

  'Pull new contact details from Twitter': function (client) {
    client
      .pause(1000)
      .click('[data-action="add-new"]')
      .waitForElementVisible('.modal-body', 1000)
      .setValue('[data-field="contact-name"]', '@twitter')
      .submitForm('.modal-body form')
      .waitForElementVisible('#contact-create-name', 1000)

      client
        .expect.element('#contact-create-screenName').value.to.equal('twitter').before(1000)
      client
        .expect.element('#contact-create-name').value.to.equal('Twitter').before(5000)
      client
        .expect.element('#contact-create-avatar').to.have.attribute('src').not.equal('/images/avatar.svg').before(5000)
  },

  'Create new contact': function (client) {
    client
      .pause(1000)
      .click('.modal-body .btn-primary')
      .waitForElementVisible('#contact-role-org', 1000)
      .click('[data-dismiss="modal"]')

      client
        .expect.element('tbody .contact-row:last-child .col-name').text.to.equal('Twitter').before(1000)
  },

  'Shut down client': function (client) {
    client
      .end()
  }
}
