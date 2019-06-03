(function () {
  'use strict';
  angular.module('app').controller('aliensController', aliensController);

  aliensController.$inject = ['$scope', '$state'];
  
  function aliensController ($scope, $state) {
    var vm = this;

    vm.gameTime = 10;
    vm.timeLeft = vm.gameTime;
    vm.finishMessage = 'Bien hecho!'
    vm.grid = [];

    vm.instructionsMessage = 'Presiona los circulos que contienen extra-terrestres'

    vm.alienColorSets = [
      'alien-color-set-1',
      'alien-color-set-2',
      'alien-color-set-3',
      'alien-color-set-4',
      'alien-color-set-5',
      'alien-color-set-6',
      'alien-color-set-7'
    ];

    vm.currentColorSetIndex = 0;
    vm.colorSets = [
      {
        name: 'color-set-1',
        grid: {
          x: 5,
          y: 3
          //15
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
          }
        ]
      },{
        name: 'color-set-1',
        grid: {
          x: 6,
          y: 4
          //24
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
            repeat: 2
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
            repeat: 2
          }
        ]
      },{
        name: 'color-set-1',
        grid: {
          x: 8,
          y: 5
          //40
          // 10 se ven
          // 8 no se ven
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
            repeat: 2
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
            repeat: 2
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
            repeat: 3
          }
        ]
      }
    ];

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
      vm.currentColorSetIndex++;
      vm.grid = [];
      init();
      vm.timeLeft = vm.gameTime;
    }

    function finishGame() {
      clearInterval(vm.gameInterval);
      setStatusBarTimeLeft(0);
      setStatusBarMessage(vm.finishMessage);
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
  }

})();
