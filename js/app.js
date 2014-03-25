(function (angular) {
  'use strict';

  var intakeApp = angular.module('intakeApp', [
    'ngRoute',
    'checklist-model',
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
          controller: 'IntakeFormNewCtrl'
        })
        .when('/roles/edit', {
          redirectTo: '/roles/new'
        })
        .when('/roles/edit/:guid', {
          templateUrl: 'partials/roles--edit.html',
          controller: 'IntakeFormEditCtrl'
        })
        .when('/vision', {
          templateUrl: 'partials/vision.html',
          controller: 'IntakeVisionCtrl'
        })
        .when('/content-models', {
          templateUrl: 'partials/schema.html',
          controller: 'IntakeContentModelCtrl'
        })
        .when('/content-models/new', {
          templateUrl: 'partials/schema--select.html',
          controller: 'IntakeContentModelCtrl'
        })
        .when('/content-models/new/:type', {
          templateUrl: 'partials/schema--edit.html',
          controller: 'IntakeContentModelNewCtrl'
        })
        .when('/personas', {
          templateUrl: 'partials/personas.html',
          controller: 'IntakePersonasCtrl'
        })
        .when('/personas/new', {
          templateUrl: 'partials/personas--edit.html',
          controller: 'IntakeFormNewCtrl'
        })
        .when('/personas/edit', {
          redirectTo: '/personas/new'
        })
        .when('/personas/edit/:guid', {
          templateUrl: 'partials/personas--edit.html',
          controller: 'IntakeFormEditCtrl'
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
