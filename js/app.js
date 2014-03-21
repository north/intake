(function (angular) {
  'use strict';

  var intakeApp = angular.module('intakeApp', [
    'ngRoute',
    'intakeControllers',
    'intakeDirectives',
    'intakeFilters'
  ]);

  intakeApp.config(['$routeProvider',
    function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'partials/root.html',
          controller: 'IntakeRootCtrl'
        })
        .when('/roles', {
          templateUrl: 'partials/roles.html',
          controller: 'IntakeRolesCtrl'
        })
        .when('/roles/new', {
          templateUrl: 'partials/roles--edit.html',
          controller: 'IntakeRoleNewCtrl'
        })
        .when('/roles/edit/:roleId', {
          templateUrl: 'partials/roles--edit.html',
          controller: 'IntakeRoleEditCtrl'
        })
        .when('/vision', {
          templateUrl: 'partials/vision.html',
          controller: 'IntakeVisionCtrl'
        })
        .when('/schema', {
          templateUrl: 'partials/schema.html',
          controller: 'IntakeContentModelCtrl'
        })
        .when('/personas', {
          templateUrl: 'partials/personas.html',
          controller: 'IntakePersonasCtrl'
        })
        .when('/personas/new', {
          templateUrl: 'partials/personas.html',
          controller: 'IntakePersonasCtrl'
        })
        .when('/personas/edit:personaId0', {
          templateUrl: 'partials/personas.html',
          controller: 'IntakePersonasCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    }
  ]);

  if (!String.prototype.contains) {
    String.prototype.contains = function () {
      return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
  }

  if (!String.prototype.slugify) {
    String.prototype.slugify = function () {
      return this.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    };
  }

})(window.angular);
