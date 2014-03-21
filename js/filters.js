(function (angular) {
  'use strict';

  var intakeFilters = angular.module('intakeFilters', []);

  intakeFilters.filter('schemaTypeFilter', function () {
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

})(window.angular);
