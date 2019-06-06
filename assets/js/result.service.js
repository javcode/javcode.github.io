(function () {
  'use strict';

  angular.module('app')
    .factory('resultService', resultService);

  function resultService () {
      var vm = this;
      vm.results = {};

      vm.history = [];

      var service = {
        startGame: function(game) {
          if(vm.results[game]) {
            vm.results[game] = {};
          }
        },
        setResult: function(game, index, result) {
          if(!vm.results[game]) {
            vm.results[game] = {};
          }
          vm.results[game][index + ''] = result;
          console.log('results', vm.results);
        },
        getResults(game, index) {
          return _.get(vm.results, [game,index].join('.'));
        },
        finishGame() {
          vm.history.push(_.clone(vm.results));
        }
      };

      return service;
  }

})();
