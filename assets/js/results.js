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

    vm.colorBlindDetermination = {
      'game-color-picker-1': {
        'deutan': [
          'color-set-1',
          'color-set-2',
          'color-set-3'
        ]
      },
      'game-color-picker-2': {
        'deutan': [
          'color-set-1'
        ]
      },
      'game-color-picker-3': {
        'protan': [
          'color-set-1',
          'color-set-3'
        ]
      }
    }

    function calculateAllResults() {
      calculateStarsGameResult();
    }

    vm.starsGameDetermination = {
      'star-colors-1': {
        'deutan': [
          'star-color-set-3'
        ]
      },
      'star-colors-2': {
        'protan': [
          'star-color-set-1'
        ]
      },
      'star-colors-3': {
        'deutan': [
          'star-color-set-4'
        ]
      }
    }


    function calculateStarsGameResult() {
      var gameName = 'stars-game';
      var protanTotal = _.reduce(_.keys(vm.starsGameDetermination), function(sum,gameKey) {
        return sum + (vm.starsGameDetermination[gameKey].protan ? 1 : 0)
      }, 0);
      var protanMatches = _.reduce(_.keys(vm.results[gameName]), function(sum,gameKey) {
        var protanExpectedMatches = vm.starsGameDetermination[gameKey].protan;
        if(protanExpectedMatches) {
          var gameKeyResults = vm.results[gameName][gameKey];
          return _.reduce(gameKeyResults, function(sum, n) {
            return sum + (n.value == true && protanExpectedMatches.includes(n.name) ? 1 : 0);
          }, 0);
        } else {
          return 0;
        }
      }, 0);

      var deutanTotal = _.reduce(_.keys(vm.starsGameDetermination), function(sum,gameKey) {
        return sum + (vm.starsGameDetermination[gameKey].deutan ? 1 : 0)
      }, 0);
      var deutanMatches = _.reduce(_.keys(vm.results[gameName]), function(sum,gameKey) {
        var deutanExpectedMatches = vm.starsGameDetermination[gameKey].deutan;
        if(deutanExpectedMatches) {
          var gameKeyResults = vm.results[gameName][gameKey];
          return _.reduce(gameKeyResults, function(sum, n) {
            return sum + (n.value == true && deutanExpectedMatches.includes(n.name) ? 1 : 0);
          }, 0);
        } else {
          return 0;
        }
      }, 0);
      vm.gameResults[gameName] = {
        protanTotal: protanTotal,
        protanMatches: protanMatches,
        deutanTotal: deutanTotal,
        deutanMatches: deutanMatches
      }
    }

  }

})();
