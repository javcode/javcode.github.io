(function () {
  'use strict';
  angular.module('app').controller('aliensController', aliensController);

  aliensController.$inject = ['$scope', '$state', 'resultService'];
  
  function aliensController ($scope, $state, resultService) {
    var vm = this;

    vm.gameTime = 10;
    vm.timeLeft = vm.gameTime;
    vm.finishMessage = 'Bien hecho!'
    vm.grid = [];

    vm.instructionsMessage = 'Presiona los circulos que contienen extra-terrestres'

    vm.currentColorSetIndex = 0;
    vm.colorSets = [
      {
        name: 'color-set-1',
        grid: {
          x: 5,
          y: 3
          //15
        },
        result: { 
          name: 'color-set-1',
          aliens: {}, 
          circles: {},
          total: 4
        },
        circles: [
          {
            circle: 'circle-color-set-1',
            repeat: 2
          },
          {
            circle: 'circle-color-set-2',
            alien: 'alien-color-set-1', //rosa
            match: true
          },
          {
            circle: 'circle-color-set-3',
          },
          {
            circle: 'circle-color-set-4',
          },
          {
            circle: 'circle-color-set-5',
            alien: 'alien-color-set-2', //amarillo
            match: true
          },
          {
            circle: 'circle-color-set-4',
            alien: 'alien-color-set-1', //rosa
            match: true
          },
          {
            circle: 'circle-color-set-6',
            alien: 'alien-color-set-3', // piel
            match: true
          },
          {
            circle: 'circle-color-set-7'
          },
          {
            circle: 'circle-color-set-8',
            alien: 'alien-color-set-4', // violeta
            match: true
          },
          {
            circle: 'circle-color-set-6',
          },
          {
            circle: 'circle-color-set-8',
            alien: 'alien-color-set-5', // verde
            match: true
          },
          {
            circle: 'circle-color-set-5'
          },
          {
            circle: 'circle-color-set-2',
          },
          {
            circle: 'circle-color-set-3',
            alien: 'alien-color-set-6', // naranja
            match: true
          }
        ]
      },{
        name: 'color-set-2',
        grid: {
          x: 6,
          y: 4
          //24
        },
        result: { 
          name: 'color-set-2',
          aliens: {}, 
          circles: {}
        },
        circles: [
          {
            circle: 'circle-color-set-1',
            repeat: 2
          },
          {
            circle: 'circle-color-set-2',
            alien: 'alien-color-set-1', //rosa
            match: true
          },
          {
            circle: 'circle-color-set-3',
            repeat: 2
          },
          {
            circle: 'circle-color-set-4',
          },
          {
            circle: 'circle-color-set-5',
            alien: 'alien-color-set-2', //amarillo
            match: true,
            repeat: 2
          },
          {
            circle: 'circle-color-set-4',
            alien: 'alien-color-set-1', //rosa
            match: true,
            repeat: 2
          },
          {
            circle: 'circle-color-set-6',
            alien: 'alien-color-set-3', // piel
            repeat: 2,
            match: true
          },
          {
            circle: 'circle-color-set-7',
            repeat: 2
          },
          {
            circle: 'circle-color-set-8',
            alien: 'alien-color-set-4', // violeta
            match: true,
            repeat: 2
          },
          {
            circle: 'circle-color-set-6',
            repeat: 2
          },
          {
            circle: 'circle-color-set-8',
            alien: 'alien-color-set-5', // verde
            match: true
          },
          {
            circle: 'circle-color-set-5',
            repeat: 2
          },
          {
            circle: 'circle-color-set-2',
          },
          {
            circle: 'circle-color-set-3',
            alien: 'alien-color-set-6', // naranja
            repeat: 2,
            match: true
          }
        ]
      },{
        name: 'color-set-3',
        grid: {
          x: 8,
          y: 5
          //40
          // 10 se ven
          // 8 no se ven
        },
        result: { 
          name: 'color-set-3',
          aliens: {}, 
          circles: {}
        },
        circles: [
          {
            circle: 'circle-color-set-1',
            repeat: 3
          },
          {
            circle: 'circle-color-set-2',
            alien: 'alien-color-set-1', //rosa
            match: true,
            repeat: 3
          },
          {
            circle: 'circle-color-set-3',
            repeat: 3
          },
          {
            circle: 'circle-color-set-4',
            repeat: 2
          },
          {
            circle: 'circle-color-set-5',
            alien: 'alien-color-set-2', //amarillo
            match: true,
            repeat: 4
          },
          {
            circle: 'circle-color-set-4',
            alien: 'alien-color-set-1', //rosa
            match: true,
            repeat: 4
          },
          {
            circle: 'circle-color-set-6',
            alien: 'alien-color-set-3', // piel
            repeat: 2,
            match: true
          },
          {
            circle: 'circle-color-set-7',
            repeat: 3
          },
          {
            circle: 'circle-color-set-8',
            alien: 'alien-color-set-4', // violeta
            match: true,
            repeat: 3
          },
          {
            circle: 'circle-color-set-6',
            repeat: 3
          },
          {
            circle: 'circle-color-set-8',
            alien: 'alien-color-set-5', // verde
            repeat: 2,
            match: true
          },
          {
            circle: 'circle-color-set-5',
            repeat: 3
          },
          {
            circle: 'circle-color-set-2',
            repeat: 2
          },
          {
            circle: 'circle-color-set-3',
            alien: 'alien-color-set-6', // naranja
            repeat: 3,
            match: true
          }
        ]
      }
    ];

    vm.circleClick = circleClick;
    vm.statusBar = {
      currentMessage: vm.instructionsMessage,
      timeLeft: '00:10'
    }

    $scope.$on('$viewContentLoaded', function(){
      init();
    });

    function init() {
      vm.currentColorSet = vm.colorSets[vm.currentColorSetIndex];
      var grid = document.querySelector('.alien-grid');
      var gridWidth = grid.clientWidth;
      var gridHeight = grid.clientHeight;
      var grid = vm.currentColorSet.grid;

      var divWidth =  gridWidth / grid.x;
      var divHeight =  gridHeight / grid.y;

      var allItems = [];
      _.each(vm.currentColorSet.circles, function(entry) {
        var repeat = entry.repeat || 1;
        for(var i = 0; i < repeat; i++) {
          allItems.push(entry);
        }
      });
      
      allItems = _.shuffle(allItems);

      generate(allItems, divWidth, divHeight, vm.currentColorSet);
      setTimeout(startGame, 3000);
    }

    function generate(itemList, divWidth, divHeight, colorSetDistribution) {
      for(var i = 0; i < itemList.length; i++) {
        var item = itemList[i];
        var newItem = {
          isAlien: item.alien ? true : false,
          circleClass: item.circle,
          alienClass: item.alien,
          style: {
            'width': divWidth  + 'px',
            'height': divHeight + 'px'
          }
        }
        vm.grid.push(newItem);
      }
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
      vm.colorSets[vm.currentColorSetIndex].result.total = _.reduce(vm.colorSets[vm.currentColorSetIndex].circles, function(sum,n) {
        return sum + (n.match ? n.repeat || 1 : 0)
      }, 0);
      resultService.setResult('aliens', vm.colorSets[vm.currentColorSetIndex].name, _.cloneDeep(vm.colorSets[vm.currentColorSetIndex].result));
      vm.currentColorSetIndex++;
      vm.grid = [];
      init();
      vm.timeLeft = vm.gameTime;
    }

    function finishGame() {
      clearInterval(vm.gameInterval);
      setStatusBarTimeLeft(0);
      setStatusBarMessage(vm.finishMessage);
      vm.colorSets[vm.currentColorSetIndex].result.total = _.reduce(vm.colorSets[vm.currentColorSetIndex].circles, function(sum,n) {
        return sum + (n.match ? n.repeat || 1 : 0)
      }, 0);
      resultService.setResult('aliens', vm.colorSets[vm.currentColorSetIndex].name, _.cloneDeep(vm.colorSets[vm.currentColorSetIndex].result));
      setTimeout(function() {
        $state.go('intro', {
          state: 'finish'
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

    function circleClick(circle) {
      if(!circle.alreadyClicked) {
        var match = circle.isAlien;
        vm.colorSets[vm.currentColorSetIndex].result.matches = vm.colorSets[vm.currentColorSetIndex].result.matches || 0;
        vm.colorSets[vm.currentColorSetIndex].result.misses = vm.colorSets[vm.currentColorSetIndex].result.misses || 0;
        if(match) {
          vm.colorSets[vm.currentColorSetIndex].result.matches++;
          var alienClass = circle.alienClass;
          vm.colorSets[vm.currentColorSetIndex].result.aliens[alienClass] = vm.colorSets[vm.currentColorSetIndex].result.aliens[alienClass] || 0;
          vm.colorSets[vm.currentColorSetIndex].result.aliens[alienClass]++;
        } else {
          vm.colorSets[vm.currentColorSetIndex].result.misses++;
          var circleClass = circle.circleClass;
          vm.colorSets[vm.currentColorSetIndex].result.circles[circleClass] = vm.colorSets[vm.currentColorSetIndex].result.circles[circleClass] || 0;
          vm.colorSets[vm.currentColorSetIndex].result.circles[circleClass]++;
        }
        circle.alreadyClicked = true;
      }
    }
  }

})();
