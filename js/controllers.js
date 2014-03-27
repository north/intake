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
  intakeControllers.controller('IntakeContentModelCtrl', function ($scope, dataService) {
    $scope.personas = dataService.get('personas');
    $scope.schemas = dataService.get('content-models');
  });


  intakeControllers.controller('IntakeContentModelSelectCtrl', function ($scope, $timeout, schemaService) {
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

  //////////////////////////////
  // Details Controller
  //////////////////////////////
  intakeControllers.controller('IntakeBenefitCtrl', function ($scope, $timeout) {
    $scope.fibonacci = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
    $scope.$parent.benefitsActive = false;

    $scope.$parent.benefitClick = function (e) {
      var detailSet = false;
      //////////////////////////////
      // Benefits
      //////////////////////////////
      angular.forEach($scope.$parent.benefits, function (v, k) {
        if (v.persona === e) {
          $scope.benefit = $scope.benefits[k];
          detailSet = true;
          return;
        }
      });

      if (!detailSet) {
        $scope.benefit = {
          'guid': e,
          'value': 1
        };
      }

      angular.forEach($scope.$parent.personas, function (v) {
        if (v.guid === e) {
          $scope.name = v.name;
          return;
        }
      });

      //////////////////////////////
      // Set items
      //////////////////////////////
      if (document.getElementById('benefits--' + e).checked) {
        $scope.$parent.benefitsActive = true;
        $timeout(function () {
          document.getElementById('details--benefit').scrollIntoView(true);
        });
      }
      else {
        $scope.$parent.benefitsActive = false;
      }
    };

    $scope.benefitCancel = function (e) {
      var detailSet = false;

      angular.forEach($scope.$parent.benefits, function (v) {
        if (v.guid === e) {
          detailSet = true;
          return;
        }
      });


      if (!detailSet) {
        document.getElementById('benefits--' + e).checked = false;
      }
      $scope.$parent.benefitsActive = false;
    };

    $scope.benefitSave = function (e) {
      var detailSet = false;

      angular.forEach($scope.$parent.benefits, function (v, k) {
        if (v.guid === e) {
          $scope.benefits[k] = $scope.benefit;
          detailSet = true;
          return;
        }
      });

      if (!detailSet) {
        $scope.$parent.benefits.push($scope.benefit);
      }

      $scope.$parent.benefitsActive = false;
    };
  });

  //////////////////////////////
  // Details Controller
  //////////////////////////////
  intakeControllers.controller('IntakeDetailCtrl', function ($scope, $sce, $timeout) {
    $scope.datatypes = $scope.$parent.datatypes;
    $scope.properties = $scope.$parent.schemaAll.properties;
    $scope.type = '';
    $scope.$parent.detailsActive = false;

    $scope.$parent.detailClick = function (e) {
      var detailSet = false;

      //////////////////////////////
      // Attribute Details
      //////////////////////////////
      angular.forEach($scope.$parent.attributes, function (v, k) {
        if (v.id === e) {
          $scope.detail = $scope.attributes[k];
          detailSet = true;
          return;
        }
      });

      if (!detailSet) {
        $scope.detail = {
          'id': e,
          'label': $scope.properties[e].label,
          'description': $sce.trustAsHtml($scope.properties[e].comment),
          'datatype': 'Text'
        };
      }



      //////////////////////////////
      // Set items
      //////////////////////////////
      if (document.getElementById('details--' + e).checked) {
        $scope.$parent.detailsActive = true;
        $timeout(function () {
          document.getElementById('details--attributes').scrollIntoView(true);
        });
      }
      else {
        $scope.$parent.detailsActive = false;
      }
    };

    $scope.detailCancel = function (e) {
      var detailSet = false;

      angular.forEach($scope.$parent.attributes, function (v) {
        if (v.id === e) {
          detailSet = true;
          return;
        }
      });


      if (!detailSet) {
        document.getElementById('details--' + e).checked = false;
      }
      $scope.$parent.detailsActive = false;
    };

    $scope.detailSave = function (e) {
      var detailSet = false;

      //////////////////////////////
      // Attribute Details
      //////////////////////////////
      angular.forEach($scope.$parent.attributes, function (v, k) {
        if (v.id === e) {
          $scope.attributes[k] = $scope.detail;
          detailSet = true;
          return;
        }
      });

      if (!detailSet) {
        $scope.$parent.attributes.push($scope.detail);
      }

      $scope.$parent.detailsActive = false;
    };
  });

  intakeControllers.controller('IntakeContentModelNewCtrl', function ($scope, $routeParams, $timeout, $location, dataService, schemaService) {
    schemaService.get().then(function (schema) {
      $scope.schemaAll = schema;
      $scope.type = schemaService.type();
      $scope.properties = schemaService.properties();
      $scope.datatypes = schemaService.datatypes();
      $scope.personas = dataService.get('personas');

      $scope.step = 'basic';
      $scope.stepName = 'Basic Info';
      $scope.button = 'Next';
      $scope.search = {};
      $scope.schema = {};
      $scope.selected = {};
      $scope.benefits = [];
      $scope.attributes = [];

      $scope.back = function () {
        switch ($scope.step) {
          case 'value':
            $scope.step = 'basic';
            $scope.stepName = 'Basic Info';
            break;
          case 'attributes':
            $scope.step = 'value';
            $scope.stepName = 'Benefits and Value';
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
            $scope.stepName = 'Basic Info';
            break;
          case 'value':
            $scope.step = 'attributes';
            $scope.stepName = 'Attributes';
            $scope.button = 'Save';
            break;
          case 'attributes':
            $scope.schema.selected = $scope.selected;
            $scope.schema.benefits = $scope.benefits;
            $scope.schema.attributes = $scope.attributes;

            schemaService.save($scope.schema);
            break;
        }
      };
    });
  });

  intakeControllers.controller('IntakeContentModelEditCtrl', function ($scope, $location, dataService) {
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



})(window.angular);
