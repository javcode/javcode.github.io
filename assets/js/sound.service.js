(function () {
  'use strict';

  angular.module('app')
    .factory('soundService', soundService);

  function soundService () {
      var vm = this;

      vm.audioContainer = '.audio-container';

      vm.soundLibrary = {
        'button-click': {
          playing: false
        }
      }

      var service = {
        play: function(soundId) {
          if(vm.soundLibrary[soundId] && !vm.soundLibrary[soundId].playing) {
            var soundElement = document.querySelector(vm.audioContainer + ' #' + soundId);
            soundElement.play();
            soundElement.onended = service.audioEnded(soundId);
          }
        },
        audioEnded: function(soundId) {
          return function() {
            if(vm.soundLibrary[soundId] && vm.soundLibrary[soundId].playing) {
              vm.soundLibrary[soundId].playing = false;
            }
          }
        },
        pause: function(soundId) {
          if(vm.soundLibrary[soundId] && vm.soundLibrary[soundId].playing) {
            var soundElement = document.querySelector(vm.audioContainer + ' ' + soundId);
            soundElement.pause();
            vm.soundLibrary[soundId].playing = false;
          }
        }
      };

      return service;
  }

})();
