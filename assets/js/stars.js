(function () {
  'use strict';
  angular.module('app')
    .controller('starsSpottingController', function ($scope, $state, $q, $timeout, resultService, soundService) {
      var vm = this;
      
      vm.gameTime = 5;
      vm.gameStartDelay = 3000;
      vm.timeLeft = vm.gameTime;
      vm.grid = {
        dimensions: {
          x: 10,
          y: 6
        },
        circles: 28,
        stars: 12,
        items: []
      }

      vm.instructionsMessage = 'Presiona los cuadros que contengan estrellas';
      vm.finishMessage = 'Bien hecho!';

      vm.statusBar = {
        currentMessage: vm.instructionsMessage
      }
      vm.currentColorSetIndex = 0;

      vm.starsConfiguration = {
        noStars: [1,2,3],
        stars: [4,5,6,7,8,9]
      }

      vm.starsQueueCurrentIndex = 0;
      vm.starsQueue = [];

      vm.colorSets = [
        'star-colors-1',
        'star-colors-2',
        'star-colors-3'
      ];

      vm.colorBlindDetermination = {
        deutan: 8,
        protan: 7
      };

      vm.currentColorSet = vm.colorSets[vm.currentColorSetIndex]

      vm.decisionClick = decisionClick;
      vm.enableGame = false;

      function init() {
        vm.enableGame = false;
        vm.results={
          deutan: 0,
          protan: 0,
          stars: {
            success: [],
            missed: []
          },
          noStars: {
            success: [],
            missed: []
          },
        };
        generateRandomStars();
        setTimeout(startGame, vm.gameStartDelay);
      }


      init();

      function generateRandomStars() {
        vm.starsQueue = _.shuffle(_.concat(vm.starsConfiguration.noStars, vm.starsConfiguration.stars));
      }

      function startGame() {
        $scope.$apply(function(){
          vm.enableGame = true;
        });
      }

      function finishGame() {
        vm.enableGame = false;
        setStatusBarTimeLeft(0);
        setStatusBarMessage(vm.finishMessage);
        resultService.setResult('stars-select-game', 'all', vm.results);
        setTimeout(function() {
          $state.go('video', {
            state: 'extraterrestres'
          });
        }, 3000);
      }

      function setStatusBarMessage(newMessage) {
        $scope.$evalAsync(function(scope) {
          scope.vm.statusBar.currentMessage = newMessage;
        });
      }

      function setStatusBarTimeLeft(timeLeft) {
        $scope.$evalAsync(function(scope) {
          scope.vm.statusBar.timeLeft = '00:' + (timeLeft >= 10 ? timeLeft : '0' + timeLeft);
        });
      }

      function decisionClick(decisionIsYes) {
        soundService.play('button-click');
        var currentItem = vm.starsQueue[vm.starsQueueCurrentIndex];
        var currentIsStar = vm.starsConfiguration.stars.includes(currentItem);
        var isDeutan = vm.colorBlindDetermination.deutan == vm.starsQueue[vm.starsQueueCurrentIndex]
        var isProtan = vm.colorBlindDetermination.protan == vm.starsQueue[vm.starsQueueCurrentIndex]
        if(decisionIsYes) {
          if(currentIsStar) {
            vm.results.stars.success.push(currentItem);
            if(isDeutan) vm.results.deutan--;
            if(isProtan) vm.results.protan--;
          } else {
            vm.results.noStars.missed.push(currentItem);
          }

        } else {
          if(currentIsStar) {
            vm.results.stars.missed.push(currentItem);
            if(isDeutan) vm.results.deutan++;
            if(isProtan) vm.results.protan++;
          } else {
            vm.results.noStars.success.push(currentItem);
          }
        }
        if(vm.starsQueueCurrentIndex < (vm.starsQueue.length - 1)) {
          vm.starsQueueCurrentIndex++;
        } else {
          finishGame();
        }
      }
    });
})();