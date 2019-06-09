(function () {
  'use strict';

  angular.module('app')
    .factory('resultService', resultService);

  function resultService () {
      var vm = this;
      vm.results = {};

      vm.history =  [];

      function init() {
        var resultsHistory = localStorage.getItem('results');
        if(resultsHistory && resultsHistory.length) {
          vm.history = JSON.parse(resultsHistory);
        }
      }

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
        getResults: function(game, index) {
          return _.get(vm.results, [game,index].join('.'));
        },
        getAllResults: function() {
          return _.keys(vm.results).length ? vm.results : (vm.history.length ? vm.history[vm.history.length-1] : {});
        },
        finishGame() {
          vm.history.push(_.cloneDeep(vm.results));
          localStorage.setItem('results', JSON.stringify(_.cloneDeep(vm.history)));
        }
      };

      init();

      return service;
  }

})();
