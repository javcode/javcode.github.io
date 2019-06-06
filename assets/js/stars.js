(function () {
  'use strict';
  angular.module('app')
    .controller('starsSpottingController', function ($scope, $state, $q, $timeout, resultService) {
      var vm = this;

      var flexVerticalPositions = ['center', 'flex-end', 'end'];
      var flexHorizontalPositions = ['center', 'flex-end', 'flex-start'];
      
      vm.gameTime = 10;
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

      vm.instructionsMessage = 'Presiona las estrellas de este color';
      vm.finishMessage = 'Bien hecho!';

      vm.statusBar = {
        currentMessage: vm.instructionsMessage,
        timeLeft: '00:10'
      }
      vm.currentColorSetIndex = 0;
      vm.rightColorSetClass = 'star-color-set-2';

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

      vm.starClick = starClick;

      function init() {
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
          'star-color-set-4': 0,
          'star-color-set-5': 0
        };
        setTimeout(startGame, vm.gameStartDelay);
      }


      init();

      function generateRandomColorSets() {
        var circles = [];
        _.each(_.keys(vm.colorConfigurations[vm.currentColorSetIndex].circles), function(colorSetKey) {
          var nTimes = vm.colorConfigurations[vm.currentColorSetIndex].circles[colorSetKey];
          for(var i = 0; i < nTimes; i++) {
            circles.push(colorSetKey);
          }
        });
        
        var stars = [];
        _.each(_.keys(vm.colorConfigurations[vm.currentColorSetIndex].stars), function(colorSetKey) {
          var nTimes = vm.colorConfigurations[vm.currentColorSetIndex].stars[colorSetKey];
          for(var i = 0; i < nTimes; i++) {
            stars.push(colorSetKey);
          }
        });

        return {
          circle: _.shuffle(circles),
          star: _.shuffle(stars)
        }
      }

      function generate(itemList, divWidth, divHeight, colorSetDistribution) {
        for(var i = 0; i < itemList.length; i++) {
          var item = itemList[i];
          var newItem = {
            type: item,
            colorSetClass: vm.colorSets[vm.currentColorSetIndex],
            colorClass: item == 'empty' ? '' : colorSetDistribution[item].pop(),
            style: {
              'width': divWidth  + 'px',
              'height': (item == 'circle' ? 15 : divHeight) + 'px',
              'align-self': _.sample(flexVerticalPositions),
              'justify-content': _.sample(flexHorizontalPositions),
            }
          }
          if(newItem.type == 'star') {
            newItem.rotation = randomRotationStyle();
          }
          vm.grid.items.push(newItem);
        }
      }

      function generateRandomRotationStyles() {
        vm.rotationStyles = [];
        for(var i = 0; i < 15; i++) {
          vm.rotationStyles.push({
            'transform': 'rotate( ' + Math.floor(Math.random() * Math.floor(270)) + 'deg)',
            'transform-origin': '30px 30px'
          })
        }
      }

      function randomRotationStyle() {
        var rotationIndex = Math.floor(Math.random() * Math.floor(vm.rotationStyles.length - 1));
        return vm.rotationStyles[rotationIndex];
      }

      function startGame() {
        vm.gameInterval = setInterval(function() {
          if(vm.timeLeft <= 0) {
            if(vm.currentColorSetIndex < 2) {
              finishColorSet();
            } else {
              finishGame()
            }
          } else {
            setStatusBarTimeLeft(vm.timeLeft);
          }
          vm.timeLeft--;
        }, 1000);
      }

      function finishColorSet() {
        clearInterval(vm.gameInterval);
        setStatusBarTimeLeft(0);
        setStatusBarMessage(vm.instructionsMessage);
        resultService.setResult('stars-game', vm.currentColorSet, _.cloneDeep(vm.colorConfigurations[vm.currentColorSetIndex].result));
        vm.currentColorSetIndex++;
        vm.currentColorSet = vm.colorSets[vm.currentColorSetIndex]
        vm.grid.items = [];
        init();
        vm.timeLeft = vm.gameTime;
      }

      function finishGame() {
        clearInterval(vm.gameInterval);
        setStatusBarTimeLeft(0);
        setStatusBarMessage(vm.finishMessage);
        resultService.setResult('stars-game', vm.currentColorSet, _.cloneDeep(vm.colorConfigurations[vm.currentColorSetIndex].result));
        setTimeout(function() {
          $state.go('intro', {
            state: 'third'
          });
        }, 5000);
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

      function starClick(starItem) {
        if(!starItem.alreadyClicked) {
          vm.colorConfigurations[vm.currentColorSetIndex].result[starItem.colorClass]++;
          if(!vm.colorConfigurations[vm.currentColorSetIndex].result.matches) {
            vm.colorConfigurations[vm.currentColorSetIndex].result.matches = 0
          }
          if(!vm.colorConfigurations[vm.currentColorSetIndex].result.misses) {
            vm.colorConfigurations[vm.currentColorSetIndex].result.misses = 0
          }
          if(starItem.colorClass == vm.colorConfigurations[vm.currentColorSetIndex].match) {
            vm.colorConfigurations[vm.currentColorSetIndex].result.matches++;
          } else {
            vm.colorConfigurations[vm.currentColorSetIndex].result.misses++;
          }
        }
        starItem.alreadyClicked = true;
      }
    });
})();