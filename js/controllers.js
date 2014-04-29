(function (angular) {
  'use strict';

  var intakeControllers = angular.module('intakeControllers', [
    'intakeFactories'
  ]);

  intakeControllers.controller('IntakeHeaderCtrl', ['$scope', 'dataService', function ($scope, dataService) {
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
    }]);

  //////////////////////////////
  // Basic Controllers
  //////////////////////////////
  intakeControllers.controller('IntakeRootCtrl', ['$scope', 'dataService', function ($scope, dataService) {
      $scope.project = dataService.get();

      // Save Client info when client.name changes
      $scope.$watch('project.name', function () {
        dataService.refresh();
      });
    }]);

  intakeControllers.controller('IntakeRolesCtrl', ['$scope', 'dataService', function ($scope, dataService) {
      $scope.project = dataService.get();
    }]);

  intakeControllers.controller('IntakeVisionCtrl', ['$scope', 'dataService', function ($scope, dataService) {
      $scope.project = dataService.get();

      // Save Client info when client.name changes
      $scope.$watch('project.vision', function () {
        dataService.refresh();
      });

      $scope.$watch('project.notes', function () {
        dataService.refresh();
      });
    }]);

  intakeControllers.controller('IntakePersonasCtrl', ['$scope', 'dataService', function ($scope, dataService) {
      $scope.personas = dataService.get('personas');
    }]);

  intakeControllers.controller('IntakePersonasViewCtrl', ['$scope', 'dataService', function ($scope, dataService) {
      $scope.persona = dataService.find('personas');
      // console.log($scope.persona);
    }]);

  //////////////////////////////
  // Form Controllers
  //////////////////////////////
  intakeControllers.controller('IntakeFormNewCtrl', ['$scope', '$location', 'dataService', function ($scope, $location, dataService) {
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
    }]);

  intakeControllers.controller('IntakeFormEditCtrl', ['$scope', '$location', 'dataService', function ($scope, $location, dataService) {
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
    }]);

  //////////////////////////////
  // Content Model Controllers;
  //////////////////////////////
  intakeControllers.controller('IntakeContentModelCtrl', ['$scope', '$location', 'dataService', function ($scope, $location, dataService) {
      $scope.personas = dataService.get('personas');
      $scope.schemas = dataService.get('content-models');

      $scope.newContent = function () {
        $location.path('/content-models/new');
      };
    }]);

  intakeControllers.controller('IntakeContentModelViewCtrl', ['$scope', '$sce', 'dataService', 'schemaService', function ($scope, $sce, dataService, schemaService) {
      schemaService.get().then(function (schema) {
        $scope.properties = schema.properties;
        $scope.schema = dataService.find('content-models');
        $scope.personas = dataService.get('personas');

        // Get Persona Names and Images
        angular.forEach($scope.schema.benefits, function (v, k) {
          angular.forEach($scope.personas, function (value) {
            if (value.guid === v.guid) {
              $scope.schema.benefits[k].image = value.image;
              $scope.schema.benefits[k].name = value.name;
              return;
            }
          });
        });

        angular.forEach($scope.schema.attributes, function (v, k) {
          angular.forEach($scope.properties, function (value) {
            if (v.id === value.id) {
              $scope.schema.attributes[k].description = $sce.trustAsHtml(value.comment);
              return;
            }
          });
        });

        // console.log($scope.schema);
      });
    }]);


  intakeControllers.controller('IntakeContentModelSelectCtrl', ['$scope', '$timeout', 'schemaService', function ($scope, $timeout, schemaService) {
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
    }]);

  //////////////////////////////
  // Details Controller
  //////////////////////////////
  intakeControllers.controller('IntakeBenefitCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
      $scope.fibonacci = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
      $scope.$parent.benefitsActive = false;

      $scope.$parent.benefitClick = function (e) {
        var detailSet = false;
        //////////////////////////////
        // Benefits
        //////////////////////////////
        angular.forEach($scope.$parent.benefits, function (v, k) {
          if (v.guid === e) {
            $scope.benefit = $scope.$parent.benefits[k];
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
            $scope.benefits[k] = $scope.$parentbenefit;
            detailSet = true;
            return;
          }
        });

        if (!detailSet) {
          $scope.$parent.benefits.push($scope.benefit);
        }

        $scope.$parent.benefitsActive = false;
      };
    }]);

  //////////////////////////////
  // Details Controller
  //////////////////////////////
  intakeControllers.controller('IntakeDetailCtrl', ['$scope', '$sce', '$timeout', function ($scope, $sce, $timeout) {
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
            $scope.detail = $scope.$parent.attributes[k];
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
    }]);

  intakeControllers.controller('IntakeContentModelNewCtrl', ['$scope', '$routeParams', '$timeout', '$location', 'dataService', 'schemaService', function ($scope, $routeParams, $timeout, $location, dataService, schemaService) {
      schemaService.get().then(function (schema) {
        $scope.schemaAll = schema;
        $scope.type = schemaService.type();
        $scope.properties = schemaService.properties();
        $scope.datatypes = schemaService.datatypes();
        $scope.personas = dataService.get('personas');

        // console.log($scope.properties);

        $scope.step = 'basic';
        $scope.stepName = 'Basic Info';
        $scope.button = 'Next';
        $scope.search = {};
        $scope.schema = {};
        $scope.selected = {};
        $scope.benefits = [];
        $scope.attributes = [];

        $scope.expandAttrs = function ($event) {
          $event.preventDefault();
          var expand = document.querySelector('._columns--EXPAND');

          if (expand.getAttribute('data-state') === null) {
            expand.setAttribute('data-state', 'expanded');
            $event.target.setAttribute('data-state', 'open');
          }
          else {
            expand.removeAttribute('data-state');
            $event.target.removeAttribute('data-state');
          }
        }

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
              $scope.stepName = 'Benefits and Value';
              break;
            case 'value':
              $scope.step = 'attributes';
              $scope.stepName = 'Attributes';
              $scope.button = 'Save';
              break;
            case 'attributes':
              $scope.schema.type = $scope.type.id;
              $scope.schema.selected = $scope.selected;
              $scope.schema.benefits = $scope.benefits;
              $scope.schema.attributes = $scope.attributes;

              schemaService.save($scope.schema);
              break;
          }
        };
      });
    }]);

  intakeControllers.controller('IntakeContentModelEditCtrl', ['$scope', '$routeParams', '$timeout', '$location', 'dataService', 'schemaService', function ($scope, $routeParams, $timeout, $location, dataService, schemaService) {
      schemaService.get().then(function (schema) {
        $scope.schemaAll = schema;
        $scope.remove = true;

        $scope.datatypes = schemaService.datatypes();
        $scope.personas = dataService.get('personas');

        $scope.step = 'basic';
        $scope.stepName = 'Basic Info';
        $scope.button = 'Next';
        $scope.search = {};

        $scope.schema = dataService.find('content-models');
        $scope.type = $scope.schema.type;
        $scope.properties = schemaService.properties($scope.schema.type);

        $scope.selected = $scope.schema.selected;
        $scope.benefits = $scope.schema.benefits;
        $scope.attributes = $scope.schema.attributes;

        $scope.expandAttrs = function ($event) {
          $event.preventDefault();
          var expand = document.querySelector('._columns--EXPAND');

          if (expand.getAttribute('data-state') === null) {
            expand.setAttribute('data-state', 'expanded');
            $event.target.setAttribute('data-state', 'open');
          }
          else {
            expand.removeAttribute('data-state');
            $event.target.removeAttribute('data-state');
          }
        }

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

        // Destroy a Role
        $scope.destroy = function () {
          dataService.remove('content-models');
        };

        $scope.save = function () {
          if ($scope.schema.title === undefined || $scope.schema.title === '') {
            $scope.schema.title = $scope.type.label;
          }

          switch ($scope.step) {
            case 'basic':
              $scope.step = 'value';
              $scope.stepName = 'Benefits and Value';
              break;
            case 'value':
              $scope.step = 'attributes';
              $scope.stepName = 'Attributes';
              $scope.button = 'Save';
              break;
            case 'attributes':
              $scope.schema.type = $scope.type;
              $scope.schema.selected = $scope.selected;
              $scope.schema.benefits = $scope.benefits;
              $scope.schema.attributes = $scope.attributes;

              schemaService.save($scope.schema, true);
              break;
          }
        };

      });
    }]);

})(window.angular);
