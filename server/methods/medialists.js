Meteor.methods({

  'medialists/create': function (medialist) {
    if (!this.userId) throw new Meteor.Error('Only a logged-in user can create a medialist')

    medialist.createdAt = new Date()
    medialist.createdBy = this.userId
    medialist.contacts = []
    medialist.slug = slugify(medialist.name)

    check(medialist, Schemas.Medialists)

    return Medialists.insert(medialist)
  }

});
