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

  intakeFactories.factory('dataService', ['$location', '$routeParams', 'localStorageService', function ($location, $routeParams, localStorageService) {
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
    }]);

  intakeFactories.factory('schemaService', ['$routeParams', '$sce', '$http', '$q', 'localStorageService', 'dataService', function ($routeParams, $sce, $http, $q, localStorageService, dataService) {
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

          if (typeof(type) === 'string') {
            type = schema.types[type];
          }

          angular.forEach(type.properties, function (v) {
            if (schema.properties[v].comment.indexOf('legacy ') === -1) {
              properties.push({
                'label': schema.properties[v].label,
                'desc': $sce.trustAsHtml(schema.properties[v].comment),
                'id': schema.properties[v].id
              });
            }
          });

          return properties;
        },
        datatypes: function () {
          return schema.datatypes;
        },
        save: function (model, update) {
          update = update || false;
          var finalModel = {};

          if (model.guid !== undefined) {
            finalModel.guid = model.guid;
          }

          finalModel.type = model.type;
          finalModel.title = model.title;
          finalModel.description = model.description;
          finalModel.selected = {};
          finalModel.selected.attributes = [];
          finalModel.selected.benefits = [];
          finalModel.attributes = [];
          finalModel.benefits = [];
          finalModel.value = 0;

          //////////////////////////////
          // Filter by Selected
          //////////////////////////////
          if (model.selected.attributes.length > 0) {
            angular.forEach(model.selected.attributes, function (k) {
              angular.forEach(model.attributes, function (v) {
                if (v.id === k) {

                  finalModel.attributes.push(v);
                }
              });
            });
          }

          if (model.selected.benefits.length > 0) {
            angular.forEach(model.selected.benefits, function (k) {
              angular.forEach(model.benefits, function (v) {
                if (v.guid === k) {
                  finalModel.benefits.push(v);
                }
              });
            });
          }

          //////////////////////////////
          // Filter by Filled Out
          //////////////////////////////
          if (finalModel.attributes.length > 0) {
            angular.forEach(finalModel.attributes, function (v) {
              angular.forEach(model.selected.attributes, function (k) {
                if (v.id === k) {
                  finalModel.selected.attributes.push(k);
                }
              });
            });
          }


          if (finalModel.benefits.length > 0) {
            angular.forEach(finalModel.benefits, function (v) {
              angular.forEach(model.selected.benefits, function (k) {
                if (v.guid === k) {
                  finalModel.selected.benefits.push(k);
                }
              });
            });
          }

          angular.forEach(finalModel.benefits, function (v) {
            finalModel.value += parseInt(v.value);
          });

          if (!update) {
            dataService.add('content-models', finalModel);
          }
          else {
            dataService.update('content-models', finalModel);
          }

        }
      };
    }]);

})(window.angular);
