(function () {
  'use strict';
  angular.module('app').controller('introController', introController);

  introController.$inject = ['$scope', '$state', '$stateParams'];
  
  function introController ($scope, $state, $stateParams) {
    var vm = this;
    vm.start = start;

    var states = {
      first: {
        video:  '/assets/videos/pickle.mp4',
        nextState: 'colorpicker'
      },
      second: {
        video:  '/assets/videos/pickle.mp4',
        nextState: 'stars'
      },
      third: {
        video:  '/assets/videos/pickle.mp4',
        nextState: 'aliens'
      }
    }

    function preInit() {
      var state = $stateParams.state && states[$stateParams.state] ? states[$stateParams.state] : states.first;
      vm.videoUrl = state.video;
      vm.nextState = state.nextState;
    }

    preInit();

    function init() {
      disableVideoJsContextMenu();
    }

    $scope.$on('$viewContentLoaded', function(){
      console.log('viewContentLoaded');
      var videoHolderElement = document.querySelector('.video-container .video-holder');
      var videoElement = document.createElement('video');
      videoElement.id = 'intro-video';
      videoElement.src = vm.videoUrl;
      videoElement.setAttribute('class', 'video-js');
      videoHolderElement.appendChild(videoElement);

      vm.introVideoElement = videoElement;

      var videoOptions = {
        controls: false,
        fluid: true,
        preload: true
      };
      vm.introVideoJs = videojs(videoElement.id, videoOptions);
      vm.introVideoJs.src(vm.videoUrl);

      vm.introVideoJs.ready(function(){
        var player = this;

        player.on('ended', function() {
          moveToNextState();
          this.dispose();
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
      $state.go(vm.nextState);
    }
  };
})();