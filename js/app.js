(function (angular) {
  'use strict';

  var intakeApp = angular.module('intakeApp', ['LocalStorageModule']);

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

  intakeApp.factory('dataService', function (localStorageService) {
    var client = localStorageService.get('client') || {};
    return {
      getClient: function () {
        return client;
      },
      setClient: function (value) {
        client = value;
      }
    };
  });

  intakeApp.directive('import', function (dataService, localStorageService) {
    return {
      restrict: 'E',
      template: 'Import: <input type="file" name="import">',
      link: function (scope, elem) {
        elem.bind('change', function (e) {
          var file = e.target.files[0];
          var reader = new FileReader();

          reader.onloadend = function (evt) {
            var importData = JSON.parse(evt.target.result);

            localStorageService.add('client', importData.client);
            location.reload(true);
          };

          reader.readAsText(file);
        });
      }
    };
  });

  intakeApp.controller('IntakeHeader', function ($scope, dataService) {
    $scope.client = dataService.getClient();
    console.log();

    $scope.IntakeDownload = function () {
      var bundle = document.createElement('a');
      var prepare = {'client': $scope.client};
      bundle.href = window.URL.createObjectURL(new Blob([JSON.stringify(prepare)], { type: 'text/plain'}));
      bundle.download = $scope.client.name.slugify() + '--intake.txt';

      document.body.appendChild(bundle);
      bundle.click();
      document.body.removeChild(bundle);
    };
  });

  intakeApp.controller('IntakeClientName', function ($scope, dataService, localStorageService) {
    $scope.client = dataService.getClient();

    // Save Client info when client.name changes
    $scope.$watch('client.name', function () {
      localStorageService.add('client', $scope.client);
    });
  });

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

  intakeApp.controller('IntakeContentModelCtrl', function ($scope, $http, localStorageService) {

    function setScope(schema) {
      $scope.dataTypes = schema.datatypes;
      $scope.properties = schema.properties;
      $scope.types = schema.types;
    }

    var schema = localStorageService.get('schema');
    if (!schema) {
      $http.get('data/all.json').success(function (schema) {
        localStorageService.add('schema', schema);
        setScope(schema);
      });
    }
    else {
      setScope(schema);
    }
  });


})(window.angular);
