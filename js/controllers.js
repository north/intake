(function (angular) {
  'use strict';



  var intakeControllers = angular.module('intakeControllers', [
    'LocalStorageModule',
    'intakeFactories'
  ]);

  intakeControllers.controller('IntakeHeaderCtrl', function ($scope, dataService) {
    $scope.project = dataService.get();
    $scope.vision = dataService.getVision();
    // $scope.personas = dataService.getPersonas();

    $scope.IntakeDownload = function () {
      var bundle = document.createElement('a');
      var filename = $scope.project.name.slugify() || 'export';

      var prepare = {'project': $scope.project, 'vision': $scope.vision};

      bundle.href = window.URL.createObjectURL(new Blob([JSON.stringify(prepare)], { type: 'text/plain'}));
      bundle.download = filename + '.intake';

      document.body.appendChild(bundle);
      bundle.click();
      document.body.removeChild(bundle);
    };
  });

  intakeControllers.controller('IntakeRootCtrl', function ($scope, dataService, localStorageService) {
    $scope.project = dataService.get();

    // Save Client info when client.name changes
    $scope.$watch('project.name', function () {
      localStorageService.add('project', $scope.project);
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

  intakeControllers.controller('IntakeVisionCtrl', function ($scope, dataService, localStorageService) {
    $scope.vision = dataService.get('vision');

    // Save Client info when client.name changes
    $scope.$watch('vision.statement', function () {
      localStorageService.add('vision', $scope.vision);
    });
  });

  intakeControllers.controller('IntakeContentModelCtrl', function ($scope, $http, localStorageService) {
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

  intakeControllers.controller('IntakePersonasCtrl', function ($scope, dataService) {
    $scope.personas = dataService.get('personas');
  });

  intakeControllers.controller('IntakePersonasNewCtrl', function ($scope, $location, $timeout, dataService) {
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
      $timeout(function () {
        $location.path('/personas');
      });
    };
  });

})(window.angular);
