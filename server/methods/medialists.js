Meteor.methods({

  'medialists/create': function (medialist) {
    if (!this.userId) throw new Meteor.Error('Only a logged-in user can create a medialist')
    var user = Meteor.users.findOne(this.userId)
    if (typeof medialist !== 'object') throw new Meteor.Error('You must supply a medialist object')

    medialist.createdAt = new Date()
    medialist.createdBy = {
      _id: user._id,
      name: user.profile.name
    }
    medialist.updatedAt = new Date()
    medialist.updatedBy = {
      _id: user._id,
      name: user.profile.name
    }
    medialist.contacts = medialist.contacts || {}
    medialist.slug = s.slugify(medialist.name)

    check(medialist, Schemas.Medialists)

    return Medialists.insert(medialist)
  }

});
