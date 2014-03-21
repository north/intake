(function (angular) {
  'use strict';

  var intakeDirectives = angular.module('intakeDirectives', [
    'LocalStorageModule'
  ]);

  intakeDirectives.directive('import', function (dataService, localStorageService) {
    return {
      restrict: 'E',
      template: '<button name="importFileStart">Import</button> <input type="file" id="importFileUpload" name="importFileUpload" style="display: none">',
      link: function (scope, elem) {
        elem.bind('click', function () {
          var fileUpload = document.getElementById('importFileUpload');
          fileUpload.click();
          // console.log(fileUpload);
        });

        elem.bind('change', function (e) {
          var file = e.target.files[0];
          var reader = new FileReader();

          reader.onloadend = function (evt) {
            var importData = JSON.parse(evt.target.result);

            localStorageService.add('client', importData.client || {});
            localStorageService.add('vision', importData.vision || {});
            localStorageService.add('personas', importData.personas || {});
            location.reload(true);
          };

          reader.readAsText(file);
        });
      }
    };
  });

})(window.angular);
