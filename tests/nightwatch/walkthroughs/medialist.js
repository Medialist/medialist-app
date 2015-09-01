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
      .pause(1000)
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

  'Show existing contact details': function (client) {
    client
      .pause(1000)
      .click('[data-action="toggle-mainmenu"]')
      .waitForElementVisible('[href="/medialist/medialist1"]', 1000)
      .click('[href="/medialist/medialist1"]')
      .pause(100)
      .click('[data-action="toggle-mainmenu"]')
      .waitForElementNotVisible('.mainmenu-user', 1000)
      .click('[data-contact="contactone"] .col-name')
      .waitForElementVisible('.contact-slide-in', 1000)

    client
      .expect.element('#contact-detail-name').text.to.equal('Contact One').before(1000)
  },

  'Show existing contact feedback': function (client) {
    client
      .pause(1000)
      .click('[data-section="contactActivity"]')

    client
      .expect.element('.display-post-message').text.to.equal('test message').before(1000)
  },

  'Add feedback to contact': function (client) {
    client
      .pause(1000)
      .click('[data-option="logFeedback"]')
      .waitForElementVisible('[data-field="message"]', 1000)
      .setValue('[data-field="message"]', 'test message involving @contactthree and #medialist2')
      .click('.contact-activity-log .form-group [data-toggle="dropdown"]')
      .waitForElementVisible('.contact-activity-log [data-status="Hot Lead"]', 1000)
      .click('.contact-activity-log [data-status="Hot Lead"]')
      .click('[data-action="close-contact-slide-in"]')
      .pause(1000)

    client
      .expect.element('[data-contact="contactone"] [data-field="status"] span').text.to.equal('Hot Lead').before(1000)
    client
      .expect.element('[data-contact="contactone"] .col-feedback').text.to.equal('test message involving @contactthree and #medialist2\nTest User | a few seconds ago').before(1000)
  },

  'Check feedback propagates to referenced medialists/contacts': function (client) {
    client
      .pause(1000)
      .click('[data-action="toggle-mainmenu"]')
      .waitForElementVisible('.mainmenu-favourites [href="/medialist/medialist2"]', 1000)
      .click('.mainmenu-favourites [href="/medialist/medialist2"]')
      .pause(100)
      .click('[data-action="toggle-mainmenu"]')
      .waitForElementNotVisible('.mainmenu-user', 1000)

      client
        .expect.element('[data-contact="contactthree"] .col-feedback').text.to.contain('test message involving @contactthree and #medialist2').before(1000)

  },

  'Update status from medialist summary page': function (client) {
    client
      .pause(1000)
      .click('[data-contact="contactseven"] [data-field="status"] [data-toggle="dropdown"]')
      .waitForElementVisible('[data-contact="contactseven"] [data-field="status"] [data-status="Completed"]', 1000)
      .click('[data-contact="contactseven"] [data-field="status"] [data-status="Completed"]')

    client
      .expect.element('[data-contact="contactseven"] [data-field="status"] [data-toggle="dropdown"]').text.to.equal('Completed').before(1000)

  },

  'Shut down client': function (client) {
    client
      .clearDB()
      .end()
  }
}
