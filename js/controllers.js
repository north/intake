(function (angular) {
  'use strict';

  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
  }

  function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  }

  var intakeControllers = angular.module('intakeControllers', [
    'LocalStorageModule'
  ]);

  intakeControllers.factory('dataService', function (localStorageService) {
    var project = localStorageService.get('project') || {};
    var vision = localStorageService.get('vision') || {};
    var personas = localStorageService.get('personas') || {};

    return {
      getProject: function () {
        return project;
      },
      getVision: function () {
        return vision;
      },
      getPersonas: function () {
        return personas;
      },
      addRole: function (value) {
        project.roles = project.roles || [];
        project.roles.push(value);
      }
    };
  });

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

  intakeControllers.controller('IntakeRoleNewCtrl', function ($scope, $location, $timeout, dataService, localStorageService) {
    $scope.project = dataService.getProject();
    $scope.save = function () {
      var role = $scope.role;
      role.guid = guid();
      console.log(role);
      dataService.addRole($scope.role);
      localStorageService.add('project', $scope.project);
      $timeout(function () {
        $location.path('/roles');
      });
    };
  });

  intakeControllers.controller('IntakeRoleEditCtrl', function ($scope, $location, $timeout, $routeParams, dataService, localStorageService) {
    $scope.project = dataService.getProject();
    $scope.role = {};
    $scope.remove = true;
    var roleId = $routeParams.roleId;

    // Set Current Scope for Role
    $scope.project.roles.forEach(function (element) {
      if (element.guid === roleId) {
        $scope.role = element;
        return;
      }
    });

    // Destroy a Role
    $scope.destroy = function () {
      var rolesHold = [];
      $scope.project.roles.forEach(function (element) {
        if (element.guid !== roleId) {
          rolesHold.push(element);
        }
      });
      $scope.project.roles = rolesHold;
      localStorageService.add('project', $scope.project);
      $timeout(function () {
        $location.path('/roles');
      });
    };

    // Save Changes to a Role
    $scope.save = function () {
      var rolesHold = [];
      $scope.project.roles.forEach(function (element) {
        if (element.guid === roleId) {
          rolesHold.push($scope.role);
        }
        else {
          rolesHold.push(element);
        }
      });
      $scope.project.roles = rolesHold;
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
    $scope.personas = [{
      'name': 'Sam'
    },
    {
      'name': 'Mason'
    }];

  });

})(window.angular);
