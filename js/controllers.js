(function (angular) {
  'use strict';



  var intakeControllers = angular.module('intakeControllers', [
    'LocalStorageModule',
    'intakeFactories'
  ]);

  intakeControllers.controller('IntakeHeaderCtrl', function ($scope, dataService) {
    $scope.project = dataService.getProject();
    $scope.vision = dataService.getVision();
    $scope.personas = dataService.getPersonas();

    $scope.IntakeDownload = function () {
      var bundle = document.createElement('a');
      var filename = $scope.project.name.slugify() || 'export';

      var prepare = {'project': $scope.project, 'vision': $scope.vision, 'personas': $scope.personas};

      bundle.href = window.URL.createObjectURL(new Blob([JSON.stringify(prepare)], { type: 'text/plain'}));
      bundle.download = filename + '.intake';

      document.body.appendChild(bundle);
      bundle.click();
      document.body.removeChild(bundle);
    };
  });

  intakeControllers.controller('IntakeRootCtrl', function ($scope, dataService, localStorageService) {
    $scope.project = dataService.getProject();

    // Save Client info when client.name changes
    $scope.$watch('project.name', function () {
      localStorageService.add('project', $scope.project);
    });
  });

  intakeControllers.controller('IntakeRolesCtrl', function ($scope, dataService) {
    $scope.project = dataService.getProject();
  });

  intakeControllers.controller('IntakeRoleNewCtrl', function ($scope, $location, $timeout, dataService, guidService, localStorageService) {
    $scope.project = dataService.getProject();
    $scope.save = function () {
      var role = $scope.role;
      role = guidService.add(role);
      dataService.addRole($scope.role);
      localStorageService.add('project', $scope.project);
      $timeout(function () {
        $location.path('/roles');
      });
    };
  });

  intakeControllers.controller('IntakeRoleEditCtrl', function ($scope, $location, $timeout, $routeParams, dataService, guidService, localStorageService) {
    $scope.project = dataService.getProject();
    $scope.role = {};
    $scope.remove = true;
    var roleId = $routeParams.roleId;

    // Set Current Scope for Role
    $scope.role = guidService.find($scope.project.roles, roleId);
    console.log($scope.role);

    // Destroy a Role
    $scope.destroy = function () {
      $scope.project.roles = guidService.remove($scope.project.roles, roleId);
      localStorageService.add('project', $scope.project);
      $timeout(function () {
        $location.path('/roles');
      });
    };

    // Update a Role
    $scope.save = function () {
      $scope.project.roles = guidService.update($scope.project.roles, roleId, $scope.role);
      localStorageService.add('project', $scope.project);
      $timeout(function () {
        $location.path('/roles');
      });
    };
  });

  intakeControllers.controller('IntakeVisionCtrl', function ($scope, dataService, localStorageService) {
    $scope.vision = dataService.getVision();

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

  intakeControllers.controller('IntakePersonasCtrl', function ($scope) {
    $scope.image = '';
    $scope.updateImage = function (image) {
      $scope.image = image;
      console.log($scope.image);
    };
  });

})(window.angular);
