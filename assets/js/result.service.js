(function () {
  'use strict';
  angular.module('app')
    .factory('resultService', function() {
    var results = {};

    var history = [];


    var gameStarted = false;

    var service = {
      startGame: function() {
        gameStarted = true;
        results = {};
      },
      setResult: function(game, index, result) {
        if(!results[game]) {
          results[game] = {};
        }
        results[game][index] = result;
      },
      isGameStarted: function() {
        return gameStarted;
      },
      getResults(game, index) {
        return _.get(results, game + '.' + index);
      },
      finishGame() {
        gameStarted = false;
        history.push(_.clone(results));
      }
    };

    return service;
  }

  )})();
