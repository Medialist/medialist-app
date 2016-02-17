Meteor.methods({
  'contacts/import' (contacts) {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can import contacts')
  }
})
