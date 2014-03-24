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

  intakeControllers.controller('IntakeRoleNewCtrl', function ($scope, dataService) {
    $scope.project = dataService.get();
    $scope.save = function () {
      dataService.add('roles', $scope.role);
    };
  });

  intakeControllers.controller('IntakeRoleEditCtrl', function ($scope, dataService) {
    $scope.project = dataService.get();
    $scope.role = {};
    $scope.remove = true;

    // Set Current Scope for Role
    $scope.role = dataService.find('roles');

    // Destroy a Role
    $scope.destroy = function () {
      dataService.remove('roles');
    };

    // Update a Role
    $scope.save = function () {
      dataService.update('roles', $scope.role);
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

  intakeControllers.controller('IntakePersonasNewCtrl', function ($scope, dataService) {
    $scope.personas = dataService.get('personas');

    $scope.updateImage = function (image) {
      $scope.image = image;
    };

    $scope.save = function () {
      var persona = $scope.persona;
      if ($scope.image) {
        persona.image = $scope.image;
      }
      dataService.add('personas', $scope.persona);
    };
  });

})(window.angular);
