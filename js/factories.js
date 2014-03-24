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

  intakeFactories.factory('dataService', function ($location, $routeParams, localStorageService) {
    var project = localStorageService.get('project') || {};

    return {
      get: function (key) {
        if (key === undefined) {
          return project;
        }
        else {
          return project[key];
        }
      },
      refresh: function () {
        localStorageService.add('project', project);
      },
      find: function (key, guid) {
        var search = project[key];
        var elem = {};
        guid = guid || $routeParams.guid;
        search.forEach(function (element) {
          if (element.guid === guid) {
            elem = element;
            return;
          }
        });
        return elem;
      },
      add: function (key, value, redirect) {
        redirect = redirect || key;
        project[key] = project[key] || [];
        value.guid = guid();
        project[key].push(value);
        localStorageService.add('project', project);
        if (redirect !== false) {
          $location.path('/' + redirect);
        }
      },
      remove: function (key, guid, redirect) {
        var search = project[key];
        var itemHold = [];
        guid = guid || $routeParams.guid;
        redirect = redirect || key;
        search.forEach(function (element) {
          if (element.guid !== guid) {
            itemHold.push(element);
          }
        });
        project[key] = itemHold;
        localStorageService.add('project', project);
        if (redirect !== false) {
          $location.path('/' + redirect);
        }
      },
      update: function (key, value, guid, redirect) {
        var search = project[key];
        var itemHold = [];
        guid = guid || $routeParams.guid;
        redirect = redirect || key;
        search.forEach(function (element) {
          if (element.guid === guid) {
            itemHold.push(value);
          }
          else {
            itemHold.push(element);
          }
        });
        project[key] = itemHold;
        localStorageService.add('project', project);
        if (redirect !== false) {
          $location.path('/' + redirect);
        }
      }
    };
  });

  intakeFactories.factory('schemaService', function ($routeParams, $sce, $http, $q, localStorageService) {
    var schema = localStorageService.get('schema');
    return {
      get: function () {
        var promise = $q.defer();

        if (!schema) {
          $http.get('data/all.json')
            .success(function (data) {
              angular.forEach(data.types, function (value, key) {
                var parents = [];
                var children = [];

                if (value.ancestors.length > 0) {
                  angular.forEach(value.ancestors, function (v, k) {
                    parents[k] = data.types[v].label;
                  });
                  data.types[key].parents = parents.join('->');
                }

                if (value.subtypes.length > 0) {
                  angular.forEach(value.subtypes, function (v, k) {
                    children[k] = data.types[v].label;
                  });
                  data.types[key].children = children.join(', ');
                }

                if (key === 'AcceptAction') {
                  console.log(value);
                }
              });
              schema = data;
              localStorageService.add('schema', data);
              promise.resolve(data);
            });

        }
        else {
          promise.resolve(schema);
        }
        return promise.promise;
      },
      type: function () {
        return schema.types[$routeParams.type];
      },
      properties: function (type) {
        var properties = [];
        type = type || schema.types[$routeParams.type];

        angular.forEach(type.properties, function (v) {
          if (schema.properties[v].comment.indexOf('legacy ') === -1) {
            properties.push({
              'label': schema.properties[v].label,
              'desc': $sce.trustAsHtml(schema.properties[v].comment)
            });
          }
        });

        return properties;
      }
    };
  });

})(window.angular);
