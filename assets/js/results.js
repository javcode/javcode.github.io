(function () {
  'use strict';
  angular.module('app').controller('resultsController', resultsController);

  resultsController.$inject = ['$scope', '$state', 'resultService'];
  
  function resultsController ($scope, $state, resultService) {
    var vm = this;
    vm.results;
    vm.shiftArrayToRight = shiftArrayToRight;
    vm.gameResults = {};

    $scope.$on('$viewContentLoaded', function(){
      vm.results = resultService.getAllResults();
      calculateAllResults();
    });

    vm.messages = {
      deutan: 'El número de errores indica que el jugador presenta daltonismo di-cromático, tipo deuteranopia.',
      protan: 'El número de errores indica que el jugador presenta daltonismo di-cromático, tipo protanopia.',
      both: 'El número de errores indica que el jugador presenta daltonismo tricromático anómalo',
      none: 'El número de errores es mínimo, el jugador no presenta daltonismo'
    }

    vm.buttonTypes = [
      'square',
      'circle',
      'triangle'
    ];

    function shiftArrayToRight(arr, places) {
      var resultArray = _.clone(arr);
      for (var i = 0; i < places; i++) {
        resultArray.unshift(resultArray.pop());
      }
      return resultArray;
    }

    function calculateAllResults() {
      var colorPickerResults = calculateColorPicker();
      var starsResult = calculateStarsResult();
      var alienResults = calculateAlienResults();

      vm.isDeutan = _.reduce([colorPickerResults, starsResult, alienResults], function(sum, n) {
        return sum + (n.deutan ? 1 : 0)
      },0) >= 2;
      vm.isProtan = _.reduce([colorPickerResults, starsResult, alienResults], function(sum, n) {
        return sum + (n.protan ? 1 : 0)
      },0) >= 2;
      vm.isColorblindDetected = vm.isDeutan || vm.isProtan;
      if(vm.isColorblindDetected) {
        if(vm.isDeutan && vm.isProtan) {
          vm.resultMessage = vm.messages['both'];
        } else {
          vm.resultMessage = vm.isDeutan ? vm.messages['deutan'] : vm.messages['protan'];
        }
      } else {
        vm.resultMessage = vm.messages['none'];
      }
    }

    function calculateColorPicker() {
      var deutan = 0;
      var protan = 0;
      _.each(vm.results['color-picker'], function(colorSet) {
        deutan+=colorSet.deutan ? colorSet.deutan.hits : 0;
        protan+=colorSet.protan ? colorSet.protan.hits : 0;
      })
      return {
        deutan: deutan > 0,
        protan: protan > 0
      }
    }

    function calculateStarsResult() {
      var starsResult = vm.results['stars-select-game'].all;
      var deutan = starsResult.deutan;
      var protan = starsResult.protan;
      return {
        deutan: deutan > 0,
        protan: protan > 0
      }
    }

    function calculateAlienResults() {
      var deutan = 0;
      var protan = 0;
      _.each(vm.results.aliens, function(colorSet) {
        deutan+=colorSet.deutan;
        protan+=colorSet.protan;
      })
      return {
        deutan: deutan > 0,
        protan: protan > 0
      }
    }

  }

})();
