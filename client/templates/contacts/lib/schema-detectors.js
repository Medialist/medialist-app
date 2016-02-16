// Detect the field from the passed values (which could be a header or a value)
ImportSchemaDetectors = [
  {
    field: {key: 'email', label: 'Email'},
    test: value => {
      if (s.startsWith(value, 'email')) return true
      if (s.startsWith(value, 'e-mail')) return true
      return value.indexOf('@') > 0
    }
  },
  {
    field: {key: 'twitter', label: 'Twitter'},
    test: value => {
      if (s.startsWith(value, 'twitter')) return true
      if (s.include(value, 'twitter.com')) return true
      return s.startsWith(value, '@')
    }
  },
  {
    field: {key: 'facebook', label: 'Facebook'},
    test: (value) => {
      if (s.startsWith(value, 'facebook')) return true
      if (s.include(value, 'facebook.com')) return true
      return false
    }
  },
  {
    field: {key: 'mobile', label: 'Mobile'},
    test: (value) => {
      if (s.startsWith(value, 'mobile')) return true
      if (s.startsWith(value, 'cell')) return true

      if (/^[0-9 -+()]+$/.test(value)) {
        // Is mobile if remove all non numerics and it starts with 07
        return _.startsWith(value.replace(/[^0-9]/g, ''), '07')
      }

      return false
    }
  },
  {
    field: {key: 'landline', label: 'Telephone'},
    test: (value) => {
      if (s.startsWith(value, 'telephone')) return true
      if (s.startsWith(value, 'phone')) return true
      if (s.startsWith(value, '+44')) return true
      return /^[0-9 -+()]+$/.test(value)
    }
  },
  {
    field: {key: 'memberType', label: 'Member Type'},
    test: value => value === 'member type'
  },
  {
    field: {key: 'notes', label: 'Notes'},
    test: value => value === 'list notes' || value === 'notes' || value === 'gorkana short note'
  },
  {
    field: {key: 'salutation', label: 'Salutation'},
    test: value => value === 'salutation'
  },
  {
    field: {key: 'primaryOutlets', label: 'Primary Outlet(s)'},
    test: value => value === 'primary outlet'
  },
  {
    field: {key: 'otherOutlets', label: 'Other Outlets'},
    test: value => value === 'all media outlets'
  },
  {
    field: {key: 'sectors', label: 'Sector(s)'},
    test: value => value === 'sectors'
  },
  {
    field: {key: 'jobTitle', label: 'Job Title(s)'},
    test: value => value === 'job title'
  },
  {
    field: {key: 'languages', label: 'Language(s)'},
    test: value => value === 'language'
  },
  {
    field: {key: 'name', label: 'Name'},
    test: value => value === 'name'
  },
  {
    field: {key: 'forename', label: 'First Name'},
    test: value => value === 'forename' || value === 'first name'
  },
  {
    field: {key: 'surname', label: 'Last Name'},
    test: value => value === 'surname' || value === 'last name'
  },
  {
    field: {key: 'address', label: 'Address'},
    test: value => value === 'address'
  },
  {
    field: {key: 'address1', label: 'Address Line 1'},
    test: value => value === 'address line 1' || value === 'address 1'
  },
  {
    field: {key: 'address2', label: 'Address Line 2'},
    test: value => value === 'address line 2' || value === 'address 2'
  },
  {
    field: {key: 'address3', label: 'Address Line 3'},
    test: value => value === 'address line 3' || value === 'address 3'
  },
  {
    field: {key: 'city', label: 'City'},
    test: value => value === 'city' || value === 'town'
  },
  {
    field: {key: 'state', label: 'State'},
    test: value => value === 'state'
  },
  {
    field: {key: 'postcode', label: 'Postcode'},
    test: value => value === 'postcode' || s.startsWith(value, 'post code') || value === 'zipcode' || value === 'zip code'
  },
  {
    field: {key: 'country', label: 'Country'},
    test: value => value === 'country'
  }
]
