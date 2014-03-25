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
      var filename = $scope.project.name === undefined ? 'export' : $scope.project.name.slugify();

      var prepare = {'project': $scope.project};

      bundle.href = window.URL.createObjectURL(new Blob([JSON.stringify(prepare)], { type: 'text/plain'}));
      bundle.download = filename + '.intake';

      document.body.appendChild(bundle);
      bundle.click();
      document.body.removeChild(bundle);
    };
  });

  //////////////////////////////
  // Basic Controllers
  //////////////////////////////
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

  intakeControllers.controller('IntakeVisionCtrl', function ($scope, dataService) {
    $scope.project = dataService.get();

    // Save Client info when client.name changes
    $scope.$watch('project.vision', function () {
      dataService.refresh();
    });
  });

  intakeControllers.controller('IntakePersonasCtrl', function ($scope, dataService) {
    $scope.personas = dataService.get('personas');
  });

  //////////////////////////////
  // Form Controllers
  //////////////////////////////
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

    if ($scope.item.image) {
      $scope.image = $scope.item.image;
    }

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

  //////////////////////////////
  // Content Model Controllers;
  //////////////////////////////
  intakeControllers.controller('IntakeContentModelCtrl', function ($scope, $timeout, schemaService) {
    var parents = function (input) {
      var filtered = {};
      angular.forEach(input, function (value, key) {
        if (value.ancestors.length === 1 && value.subtypes.length > 0) {
          filtered[key] = value;
        }
        if (value.ancestors.length === 0) {
          filtered[key] = value;
        }
      });
      return filtered;
    };

    schemaService.get().then(function (schema) {
      // $scope.datatypes = schema.datatypes;
      // $scope.properties = schema.properties;
      $scope.types = schema.types;

      $scope.search = {};
      $scope.parents = parents($scope.types);
      $scope.search.subtype = Object.keys($scope.parents)[0];
    });
  });

  intakeControllers.controller('IntakeContentModelNewCtrl', function ($scope, $routeParams, $location, $sce, schemaService) {
    schemaService.get().then(function (schema) {
      $scope.type = schemaService.type();
      $scope.properties = schemaService.properties();
      $scope.datatypes = schemaService.datatypes();
      // console.log($scope.datatypes);
      $scope.step = 'attributes';
      $scope.button = 'Next';
      $scope.search = {};
      $scope.schema = {};
      $scope.schema.benifits = {};
      $scope.attributes = [];
      // schemaService.datatypes();

      // $scope.$watch('schema.attributes', function () {
      //   console.log($scope);
      // });

      // Update a Role
      // console.log(schema);

      $scope.checkClick = function (e) {
        var detailSet = false;
        angular.forEach($scope.attributes, function (v, k) {
          if (v.id === e) {
            $scope.detail = $scope.attributes[k];
            detailSet = true;
          }
        });

        if (!detailSet) {
          $scope.detail = {
            'id': e,
            'label': schema.properties[e].label,
            'desc': $sce.trustAsHtml(schema.properties[e].comment),
            'datatype': 'Text'
          };
        }
        if (document.getElementById('checkbox--' + e).checked) {
          $scope.active = true;
        }
        else {
          $scope.active = false;
        }

      }

      $scope.detailCancel = function (e) {
        var detailSet = false;
        angular.forEach($scope.attributes, function (v, k) {
          if (v.id === e) {
            detailSet = true;
          }
        });

        if (!detailSet) {
          document.getElementById('checkbox--' + e).checked = false;
        }

        $scope.active = false;
      }

      $scope.detailSave = function (e) {
        var detailSet = false;

        angular.forEach($scope.attributes, function (v, k) {
          if (v.id === e) {
            $scope.attributes[k] = $scope.detail;
            detailSet = true;
          }
        });

        if (!detailSet) {
          $scope.attributes.push($scope.detail);
        }

        $scope.active = false;
        console.log($scope.attributes);
      }

      $scope.back = function () {
        switch ($scope.step) {
          case 'value':
            $scope.step = 'basic';
            break;
          case 'attributes':
            $scope.step = 'value';
            break;
          case 'details':
            $scope.step = 'attributes';
            break;
        }
      };

      $scope.save = function () {
        if ($scope.schema.title === undefined || $scope.schema.title === '') {
          $scope.schema.title = $scope.type.label;
        }

        switch ($scope.step) {
          case 'basic':
            $scope.step = 'value';
            break;
          case 'value':
            $scope.step = 'attributes';
            break;
          case 'attributes':
            $scope.schema.details = [];
            angular.forEach($scope.schema.attributes, function (v) {
              $scope.schema.details.push({'id': v});
            });
            $scope.step = 'details';
            break;
          case 'details':
            // $scope.step = 'all';
            $scope.button = 'Save';
            break;
        }

        // console.log($scope.schema);
      };
    });
  });



})(window.angular);
