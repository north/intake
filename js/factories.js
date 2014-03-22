(function (angular) {
  'use strict';

  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
  }

  function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  }

  var intakeFactories = angular.module('intakeFactories', [
    'LocalStorageModule'
  ]);

  intakeFactories.factory('dataService', function (localStorageService) {
    var project = localStorageService.get('project') || {};
    var vision = localStorageService.get('vision') || {};
    var personas = localStorageService.get('personas') || {};

    return {
      getProject: function () {
        return project;
      },
      getVision: function () {
        return vision;
      },
      getPersonas: function () {
        return personas;
      },
      addRole: function (value) {
        project.roles = project.roles || [];
        project.roles.push(value);
      }
    };
  });

  intakeFactories.factory('guidService', function () {
    return {
      add: function (item) {
        item.guid = guid();
        return item;
      },
      find: function (items, guid) {
        var elem = {};
        items.forEach(function (element) {
          if (element.guid === guid) {
            elem = element;
            return;
          }
        });
        return elem;
      },
      remove: function (items, guid) {
        var itemHold = [];
        items.forEach(function (element) {
          if (element.guid !== guid) {
            itemHold.push(element);
          }
        });
        return itemHold;
      },
      update: function (items, guid, update) {
        var itemHold = [];
        items.forEach(function (element) {
          if (element.guid === guid) {
            itemHold.push(update);
          }
          else {
            itemHold.push(element);
          }
        });
        return itemHold;
      }
    };
  });

})(window.angular);