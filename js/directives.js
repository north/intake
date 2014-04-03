(function (angular, FileReaderJS) {
  'use strict';

  var intakeDirectives = angular.module('intakeDirectives', [
    'LocalStorageModule',
    'intakeFactories'
  ]);

  //////////////////////////////
  // Descriptions
  //////////////////////////////
  intakeDirectives.directive('rolesDesc', function () {
    return {
      restrict: 'A',
      templateUrl: 'partials/roles--desc.html'
    };
  });

  intakeDirectives.directive('personasDesc', function () {
    return {
      restrict: 'A',
      templateUrl: 'partials/personas--desc.html'
    };
  });

  intakeDirectives.directive('schemaDesc', function () {
    return {
      restrict: 'A',
      templateUrl: 'partials/schema--desc.html'
    };
  });

  //////////////////////////////
  // Schema Details
  //////////////////////////////
  intakeDirectives.directive('attributedetails', function () {
    return {
      restrict: 'E',
      templateUrl: 'partials/attribute.html'
    };
  });

  intakeDirectives.directive('benefits', function () {
    return {
      restrict: 'E',
      templateUrl: 'partials/benefits.html'
    };
  });

  //////////////////////////////
  // Import
  //////////////////////////////
  intakeDirectives.directive('import', ['localStorageService', function (localStorageService) {
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

            localStorageService.add('project', importData.project || {});
            location.reload(true);
          };

          reader.readAsText(file);
        });
      }
    };
  }]);

  //////////////////////////////
  // Image Drop
  //////////////////////////////
  intakeDirectives.directive('imagedrop', function () {
    return {
      restrict: 'E',
      template: '<div id="drop_zone" class="form--imagedrop"></div>',
      link: function (scope) {
        var dropZone = document.getElementById('drop_zone');
        if (scope.image) {
          dropZone.style.backgroundImage = 'url(' + scope.image + ')';
          dropZone.setAttribute('data-state', 'uploaded');
        }
        var opts = {
          readAsMap: {
            'image/*': 'DataURL'
          },
          on: {
            loadend: function (e) {

              dropZone.style.backgroundImage = 'url(' + e.target.result + ')';
              dropZone.setAttribute('data-state', 'uploaded');
              scope.updateImage(e.target.result);
            }
          }
        };

        FileReaderJS.setupDrop(document.getElementById('drop_zone'), opts);
      }
    };
  });

})(window.angular, window.FileReaderJS);
