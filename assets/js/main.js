(function () {
  'use strict';
  angular.module('app').controller('mainController', mainController);

  mainController.$inject = ['$scope', '$state', 'soundService'];
  
  function mainController ($scope, $state, soundService) {
    var vm = this;

    $scope.$on('$viewContentLoaded', function(){
      //soundService.play('wait-music')
    });

    $scope.$on('play.game.music', function() {
      soundService.pause('wait-music')
      soundService.play('game-music')
    });

    $scope.$on('play.wait.music', function() {
      soundService.pause('game-music')
      soundService.play('wait-music')
    });

    
  }

})();
