(function (angular, FileReaderJS) {
  'use strict';

  var intakeDirectives = angular.module('intakeDirectives', [
    'LocalStorageModule',
    'intakeFactories'
  ]);

  intakeDirectives.directive('attributedetails', function () {
    return {
      restrict: 'E',
      templateUrl: 'partials/attribute--detail.html'
    };
  });

  intakeDirectives.directive('benefits', function () {
    return {
      restrict: 'E',
      templateUrl: 'partials/benefits.html'
    };
  });

  intakeDirectives.directive('import', function (localStorageService) {
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
  });

  intakeDirectives.directive('imagedrop', function () {
    return {
      restrict: 'E',
      template: '<div id="drop_zone" style="height: 200px; width: 200px; border: 1px solid grey; background-size: 100%; background-repeat: no-repeat; background-position: 50% 50%;">Drop Image Here</div>',
      link: function (scope) {
        var dropZone = document.getElementById('drop_zone');
        if (scope.image) {
          dropZone.style.backgroundImage = 'url(' + scope.image + ')';
        }
        var opts = {
          readAsMap: {
            'image/*': 'DataURL'
          },
          on: {
            loadend: function (e) {

              dropZone.style.backgroundImage = 'url(' + e.target.result + ')';
              scope.updateImage(e.target.result);
            }
          }
        };

        FileReaderJS.setupDrop(document.getElementById('drop_zone'), opts);
      }
    };
  });

})(window.angular, window.FileReaderJS);
