(function () {
  'use strict';
  angular.module('app').controller('introController', introController);

  introController.$inject = ['$scope', '$state'];
  
  function introController ($scope, $state) {
    var vm = this;
    vm.start = start;
    
    function init() {
      disableVideoJsContextMenu();
    }

    $scope.$on('$viewContentLoaded', function(){
      vm.introVideoElement = document.getElementById("intro-video");
      vm.introVideoJs = videojs("intro-video");
      vm.introVideoJs.ready(function(){
        var player = this;

        player.on('ended', function() {
          moveToNextState();
        });

      });
      init();
    });

    function disableVideoJsContextMenu() {
      // disable context menu
      if (vm.introVideoElement.addEventListener) {
          vm.introVideoElement.addEventListener('contextmenu', function(e) {
              e.preventDefault();
          }, false);
      } else {
          vm.introVideoElement.attachEvent('oncontextmenu', function() {
              window.event.returnValue = false;
          });
      };
    }

    function start() {
      vm.introVideoJs.play();
    }

    function moveToNextState() {
      $state.go('colorpicker');
    }
  };
})();