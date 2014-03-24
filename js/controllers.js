(function (angular) {
  'use strict';

  var intakeControllers = angular.module('intakeControllers', [
    'intakeFactories'
  ]);

  intakeControllers.controller('IntakeHeaderCtrl', function ($scope, dataService) {
    $scope.project = dataService.get();
    // $scope.personas = dataService.getPersonas();

    $scope.IntakeDownload = function () {
      var bundle = document.createElement('a');
      var filename = $scope.project.name.slugify() || 'export';

      var prepare = {'project': $scope.project};

      bundle.href = window.URL.createObjectURL(new Blob([JSON.stringify(prepare)], { type: 'text/plain'}));
      bundle.download = filename + '.intake';

      document.body.appendChild(bundle);
      bundle.click();
      document.body.removeChild(bundle);
    };
  });

  intakeControllers.controller('IntakeRootCtrl', function ($scope, dataService) {
    $scope.project = dataService.get();

    // Save Client info when client.name changes
    $scope.$watch('project.name', function () {
      dataService.refresh();
    });
  });

  intakeControllers.controller('IntakeRolesCtrl', function ($scope, dataService) {
    $scope.project = dataService.get();
  });

  intakeControllers.controller('IntakeFormNewCtrl', function ($scope, $location, dataService) {
    $scope.project = dataService.get();
    var path = $location.path().split('/')[1];

    $scope.updateImage = function (image) {
      $scope.image = image;
    };

    $scope.save = function () {
      if ($scope.image) {
        $scope.item.image = $scope.image;
      }
      dataService.add(path, $scope.item);
    };
  });

  intakeControllers.controller('IntakeFormEditCtrl', function ($scope, $location, dataService) {
    $scope.project = dataService.get();
    $scope.remove = true;

    var path = $location.path().split('/')[1];

    // Set Current Scope for Role
    $scope.item = dataService.find(path);

    $scope.updateImage = function (image) {
      $scope.image = image;
    };

    // Destroy a Role
    $scope.destroy = function () {
      dataService.remove(path);
    };

    // Update a Role
    $scope.save = function () {
      if ($scope.image) {
        $scope.item.image = $scope.image;
      }
      dataService.update(path, $scope.item);
    };
  });

  intakeControllers.controller('IntakeVisionCtrl', function ($scope, dataService) {
    $scope.project = dataService.get();

    // Save Client info when client.name changes
    $scope.$watch('project.vision', function () {
      dataService.refresh();
    });
  });

  intakeControllers.controller('IntakeContentModelCtrl', function ($scope, dataService) {
    $scope.datatypes = dataService.getSchema('datatypes');
    $scope.properties = dataService.getSchema('properties');
    $scope.types = dataService.getSchema('types');
  });

  intakeControllers.controller('IntakePersonasCtrl', function ($scope, dataService) {
    $scope.personas = dataService.get('personas');
  });

})(window.angular);
