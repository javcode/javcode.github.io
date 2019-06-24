(function () {
  'use strict';
  angular.module('app').controller('videoController', videoController);

  videoController.$inject = ['$scope', '$state', '$stateParams', 'soundService'];
  
  function videoController ($scope, $state, $stateParams, soundService) {
    var vm = this;
    vm.start = start;

    var states = {
      presentacion: {
        video:  '/assets/videos/presentacion_personaje.mp4',
        nextState: 'video',
        nextStateParams: {
          state: 'instrucciones_generales'
        },
        playMessage: 'Comenzar'
      },
      instrucciones_generales: {
        video:  '/assets/videos/instrucciones_generales.mp4',
        nextState: 'video',
        nextStateParams: {
          state: 'nave'
        },
        autoStart: true,
        playMessage: 'Continuar'
      },
      nave: {
        video:  '/assets/videos/video_Nave.mp4',
        nextState: 'colorpicker',
        autoStart: true,
        playMessage: 'Comenzar'
      },
      estrellas: {
        video:  '/assets/videos/video_estrellas.mp4',
        nextState: 'stars',
        playMessage: 'Continuar'
      },
      extraterrestres: {
        video:  '/assets/videos/video_extraterrestres.mp4',
        nextState: 'aliens',
        playMessage: 'Continuar'
      },
      finish: {
        video:  '/assets/videos/final.mp4',
        nextState: 'menu',
        playMessage: 'Finalizar'
      }
    }

    function preInit() {
      var state = $stateParams.state && states[$stateParams.state] ? states[$stateParams.state] : states.presentacion;
      vm.videoUrl = state.video;
      vm.nextState = state.nextState;
      vm.playMessage = state.playMessage;
      vm.autoStart = state.autoStart;
      vm.nextStateParams = state.nextStateParams;
    }

    preInit();

    function init() {
      disableVideoJsContextMenu();
      if(vm.autoStart) {
        start();
      }
    }

    $scope.$on('$viewContentLoaded', function(){
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
      soundService.play('button-click');
      vm.introVideoJs.play();
    }

    function moveToNextState() {
      if(vm.nextStateParams) {
        $state.go(vm.nextState, vm.nextStateParams, {reload: true});
      } else {
        $state.go(vm.nextState);
      }
    }
  };
})();