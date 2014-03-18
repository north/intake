(function (angular, localStorage) {
  'use strict';

  var intakeApp = angular.module('intakeApp', []);

  if (!String.prototype.contains) {
    String.prototype.contains = function () {
      return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
  }

  intakeApp.filter('schemaTypeFilter', function () {
    return function (input, filterKey) {
      var filteredInput = {};

      if (filterKey === undefined) {
        return input;
      }

      var searchKeys = filterKey;
      if (typeof(searchKeys) === 'object') {
        searchKeys = Object.keys(searchKeys);
      }

      angular.forEach(input, function (value, key) {
        if (typeof(searchKeys) === 'string') {
          if (value.label && value.label.toLowerCase().contains(filterKey.toLowerCase())) {
            filteredInput[key] = value;
          }
        }
      });
      return filteredInput;
    };
  });

  intakeApp.controller('IntakeContentModelCtrl', function ($scope, $http) {

    function setScope(schema) {
      $scope.dataTypes = schema.datatypes;
      $scope.properties = schema.properties;
      $scope.types = schema.types;
    }

    var schemaAll = localStorage.getItem('schemaAll');
    if (!schemaAll) {
      $http.get('data/all.json').success(function (schema) {
        localStorage.setItem('schemaAll', JSON.stringify(schema));
        setScope(schema);
      });
    }
    else {
      setScope(JSON.parse(schemaAll));
    }




    $scope.models = [
      {'name': 'TV Episode',
        'description': 'A TV episode which can be part of a series or season.',
        'machine': 'TVEpisode'},
      {'name': 'TV Series',
        'description': 'Series dedicated to TV broadcast and associated online delivery.',
        'machine': 'TVSeries'},
      {'name': 'TV Season',
        'description': 'Season dedicated to TV broadcast and associated online delivery.',
        'machine': 'TVSeason'}
    ];

    $scope.orderProp = 'age';
  });


})(window.angular, window.localStorage);
