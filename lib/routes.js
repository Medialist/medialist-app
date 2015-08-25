// ******************* GLOBAL SETTINGS *****************************

// UTILITY FUNCTIONS

function ensureSignedIn () {
  if (!Meteor.userId() && !Meteor.loggingIn()) {
    FlowRouter.go('home')
  }
}

function dashboardIfSignedIn () {
  if (Meteor.userId()) {
    FlowRouter.go('dashboard')
  }
}

// SUBSCRIPTIONS

FlowRouter.subscriptions = function () {
  // this.register('mySub', Meteor.subscribe('mySubName'));
};

// TRIGGERS

FlowRouter.triggers.enter([
  ensureSignedIn
],
{
  only: ['dashboard']
});

FlowRouter.triggers.enter([
  dashboardIfSignedIn
],
{
  only: ['home']
});

FlowRouter.triggers.exit([
  // myExitFunc
] /* , {
  only: ['myRoute'],
  except: ['myOtherRoute']
} */);

// ************************* ROUTES ********************************
FlowRouter.route('/', {
  name: 'home',
  triggersEnter: [],
  subscriptions: function (params, queryParams) {

  },
  action: function (params, queryParams) {
    BlazeLayout.render('Layout', {main: 'home'});
  },
  triggersExit: []
});
FlowRouter.route('/dashboard', {
  name: 'dashboard',
  triggersEnter: [],
  subscriptions: function(params, queryParams) {

  },
  action: function(params, queryParams) {
    BlazeLayout.render('Layout', {main: 'dashboard'});
  },
  triggersExit: []
});
