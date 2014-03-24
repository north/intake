(function (angular) {
  'use strict';

  var intakeFilters = angular.module('intakeFilters', []);

  intakeFilters.filter('schemaTypeFilter', function () {
    return function (input, filterKey) {
      var filteredInput = {};

      angular.forEach(input, function (value, key) {
        if (value.ancestors.indexOf(filterKey.subtype) === 0) {
          if (value.ancestors.length === 1) {
            filteredInput[key] = value;
          }
        }
        else if (value.ancestors.indexOf(filterKey.subtype) !== -1) {
          filteredInput[key] = value;
        }

        if (filterKey.label !== undefined && filterKey.label !== '') {
          if (value.label && !value.label.toLowerCase().contains(filterKey.label.toLowerCase())) {
            delete filteredInput[key];
          }
        }
      });

      return filteredInput;
    };
  });

})(window.angular);
