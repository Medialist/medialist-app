// add tests to this file using the Nightwatch.js API
// http://nightwatchjs.org/api

var timeout = 3000

module.exports = {
  'Login and show menu': function (client) {
    client
      .url('http://localhost:3000')
      .clearDB()
      .populateDB()
      .login()
      .verify.elementPresent('body', 'Page loads successfully')
      .click('[data-action="toggle-mainmenu"]')
      .expect.element('.mainmenu').to.be.visible.before(timeout)
    },

  'Select and show Medialist': function (client) {
    client
      .click('a[href="/medialist/medialist1"]')
      .click('[data-action="toggle-mainmenu"]')
      .pause(1000)
    client
      .expect.element('.medialist-breadcrumbs li:last-child a').text.to.equal('#medialist1').before(timeout)
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
      .waitForElementVisible('.modal-body', timeout)
      .setValue('#medialist-name', medialistName)
      .setValue('#medialist-purpose', medialistPurpose)
      .submitForm('#addMedialist')
      .pause(1000)
    client
      .expect.element('.medialist-breadcrumbs li:last-child a').text.to.equal('#' + medialistName).before(timeout)
  },

  'Add Contact': function (client) {
    client
      .click('[data-action="add-new"]')
      .waitForElementVisible('.modal-body', timeout)
      .getText('.modal-body .media:nth-of-type(2) .media-body h5', function (name) {
        client
          .click('.modal-body .media:nth-of-type(2) [data-action="add-contact"]')
          .click('[data-dismiss="modal"]')
        client
          .expect.element('.contact-row').to.be.present.before(timeout)
        client
          .expect.element('.col-name').text.to.equal(name.value).before(timeout)
      })
  },

  'Pull new contact details from Twitter': function (client) {
    client
      .pause(1000)
      .click('[data-action="add-new"]')
      .waitForElementVisible('.modal-body', timeout)
      .setValue('[data-field="contact-name"]', '@twitter')
      .submitForm('.modal-body form')
      .waitForElementVisible('#contact-create-name', timeout)

      client
        .expect.element('#contact-create-screenName').value.to.equal('twitter').before(timeout)
      client
        .expect.element('#contact-create-name').value.to.equal('Twitter').before(timeout)
      client
        .expect.element('#contact-create-avatar').to.have.attribute('src').not.equal('/images/avatar.svg').before(timeout)
  },

  'Create new contact': function (client) {
    client
      .pause(1000)
      .click('.modal-body .btn-primary')
      .waitForElementVisible('#contact-role-org', timeout)
      .click('[data-dismiss="modal"]')

      client
        .expect.element('tbody .contact-row:last-child .col-name').text.to.equal('Twitter').before(timeout)
  },

  'Show existing contact details': function (client) {
    client
      .pause(1000)
      .click('[data-action="toggle-mainmenu"]')
      .waitForElementVisible('[href="/medialist/medialist1"]', timeout)
      .click('[href="/medialist/medialist1"]')
      .pause(100)
      .click('[data-action="toggle-mainmenu"]')
      .waitForElementNotVisible('.mainmenu-user', timeout)
      .click('[data-contact="contactone"] .col-name')
      .waitForElementVisible('.contact-slide-in', timeout)

    client
      .expect.element('#contact-detail-name').text.to.equal('Contact One').before(timeout)
  },

  'Show existing contact feedback': function (client) {
    client
      .pause(1000)
      .click('[data-section="contactActivity"]')
      .pause(1000)
    client
      .expect.element('.display-post-message').text.to.equal('test message').before(timeout)
  },

  'Add feedback to contact': function (client) {
    client
      .pause(1000)
      .click('[data-option="logFeedback"]')
      .waitForElementVisible('[data-field="message"]', timeout)
      .setValue('[data-field="message"]', 'test message involving @contactthree and #medialist2')
      .click('.contact-activity-log .form-group [data-toggle="dropdown"]')
      .waitForElementVisible('.contact-activity-log [data-status="Hot Lead"]', timeout)
      .click('.contact-activity-log [data-status="Hot Lead"]')
      .click('[data-action="close-contact-slide-in"]')
      .pause(1000)

    client
      .expect.element('[data-contact="contactone"] [data-field="status"] span').text.to.equal('Hot Lead').before(timeout)
    client
      .expect.element('[data-contact="contactone"] .col-feedback').text.to.equal('test message involving @contactthree and #medialist2\nTest User | a few seconds ago').before(1000)
  },

  'Check feedback propagates to referenced medialists/contacts': function (client) {
    client
      .pause(1000)
      .click('[data-action="toggle-mainmenu"]')
      .waitForElementVisible('.mainmenu-favourites [href="/medialist/medialist2"]', timeout)
      .click('.mainmenu-favourites [href="/medialist/medialist2"]')
      .pause(100)
      .click('[data-action="toggle-mainmenu"]')
      .waitForElementNotVisible('.mainmenu-user', timeout)

      client
        .expect.element('[data-contact="contactthree"] .col-feedback').text.to.contain('test message involving @contactthree and #medialist2').before(timeout)

  },

  'Update status from medialist summary page': function (client) {
    client
      .pause(1000)
      .click('[data-contact="contactseven"] [data-field="status"] [data-toggle="dropdown"]')
      .waitForElementVisible('[data-contact="contactseven"] [data-field="status"] [data-status="Completed"]', timeout)
      .click('[data-contact="contactseven"] [data-field="status"] [data-status="Completed"]')

    client
      .expect.element('[data-contact="contactseven"] [data-field="status"] [data-toggle="dropdown"]').text.to.equal('Completed').before(timeout)

  },

  'Check medialists page reflects recent updates': function (client) {
    client
      .pause(1000)
      .click('[data-action="toggle-mainmenu"]')
      .waitForElementVisible('.mainmenu [href="/medialists"]', timeout)
      .click('.mainmenu [href="/medialists"]')
      .waitForElementPresent('.col-campaign', timeout)
      .click('[data-action="toggle-mainmenu"]')
      .waitForElementNotVisible('.mainmenu [href="/medialists"]', timeout)

    client
      .expect.element('[data-medialist="medialist2"] .col-updated-on').text.to.equal('a few seconds ago').before(timeout)
    client
      .expect.element('[data-medialist="medialist2"] .col-updated-by').text.to.equal('Test User').before(timeout)

  },

  'Shut down client': function (client) {
    client
      .clearDB()
      .end()
  }
}
