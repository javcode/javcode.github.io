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
      vm.rightColorSetClass = 'star-color-set-2';

      vm.starsConfiguration = {
        noStars: [1,2,3],
        stars: [4,5,6,7,8,9]
      }

      vm.starsQueueCurrentIndex = 0;
      vm.starsQueue = [];

      vm.colorConfigurations = [
        {
          name: 'star-colors-1',
          circles: {
            'star-color-set-1': 14,
            'star-color-set-2': 14
          },
          stars: {
            'star-color-set-1': 4,
            'star-color-set-2': 3,
            'star-color-set-3': 3,
            'star-color-set-4': 2
          },
          match: vm.rightColorSetClass
        },
        {
          name: 'star-colors-2',
          circles: {
            'star-color-set-1': 7,
            'star-color-set-2': 7,
            'star-color-set-3': 7,
            'star-color-set-4': 7
          },
          stars: {
            'star-color-set-1': 4,
            'star-color-set-2': 4,
            'star-color-set-3': 4
          },
          match: vm.rightColorSetClass
        },
        {
          name: 'star-colors-3',
          circles: {
            'star-color-set-1': 10,
            'star-color-set-2': 9,
            'star-color-set-3': 9
          },
          stars: {
            'star-color-set-1': 4,
            'star-color-set-2': 4,
            'star-color-set-3': 2,
            'star-color-set-4': 1,
            'star-color-set-5': 2
          },
          match: vm.rightColorSetClass
        }
      ]

      vm.colorSets = [
        'star-colors-1',
        'star-colors-2',
        'star-colors-3'
      ];

      vm.currentColorSet = vm.colorSets[vm.currentColorSetIndex]

      vm.decisionClick = decisionClick;
      vm.enableGame = false;

      function init() {
        vm.enableGame = false;
        /*
        generateRandomRotationStyles();
        var colorSetDistribution = generateRandomColorSets();
        var grid = document.querySelector('.stars-grid');
        var gridWidth = grid.clientWidth;
        var gridHeight = grid.clientHeight;

        var divWidth =  gridWidth / vm.grid.dimensions.x;
        var divHeight =  gridHeight / vm.grid.dimensions.y;

        var circles = _.map(_.range(vm.grid.circles), () => 'circle');
        var stars = _.map(_.range(vm.grid.stars), () => 'star');
        var emptyRange = _.range((vm.grid.dimensions.x * vm.grid.dimensions.y) - stars.length - circles.length - 10);
        var empty = _.map(emptyRange, () => 'empty');

        var itemList = circles.concat(empty).concat(stars);
        generate(_.shuffle(itemList), divWidth, divHeight, colorSetDistribution);
        vm.colorConfigurations[vm.currentColorSetIndex].result = {
          'star-color-set-1': 0,
          'star-color-set-2': 0,
          'star-color-set-3': 0,
          'match': vm.colorConfigurations[vm.currentColorSetIndex].match,
          'expected': vm.colorConfigurations[vm.currentColorSetIndex].stars[vm.colorConfigurations[vm.currentColorSetIndex].match]
        };
        */
        vm.results={
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
        if(decisionIsYes) {
          if(currentIsStar) {
            vm.results.stars.success.push(currentItem);
          } else {
            vm.results.noStars.missed.push(currentItem);
          }

        } else {
          if(currentIsStar) {
            vm.results.stars.missed.push(currentItem);
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