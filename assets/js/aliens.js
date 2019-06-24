(function () {
  'use strict';
  angular.module('app').controller('aliensController', aliensController);

  aliensController.$inject = ['$scope', '$state', 'resultService', 'soundService'];
  
  function aliensController ($scope, $state, resultService, soundService) {
    var vm = this;

    vm.gameTime = 10;
    vm.timeLeft = vm.gameTime;
    vm.finishMessage = 'Bien hecho!'
    vm.grid = [];

    vm.instructionsMessage = 'Presiona los circulos que contienen extra-terrestres'
    vm.emptyResult = {
      aliens: {}, 
      circles: {},
      deutan: 0,
      protan: 0
    }

    vm.currentColorSetIndex = 0;
    vm.colorSets = [
      {
        name: 'color-set-1',
        grid: {
          x: 5,
          y: 3
          //15
        },
        time: 10,
        result: Object.assign(_.cloneDeep(vm.emptyResult),{
          name: 'color-set-1',
        }),
        circles: [
          {
            circle: 'circle-color-set-1', //amarelo
            alien: 'alien-color-set-1', //rojo
            match: true,
            deutan: true
          },
          {
            circle: 'circle-color-set-2', //violeta
            alien: 'alien-color-set-2', //amarillo
            match: true
          },
          {
            circle: 'circle-color-set-1',//amarelo
            alien: 'alien-color-set-3', //piel
            match: true,
            deutan: true
          },
          {
            circle: 'circle-color-set-3', // marron oscruro
            alien: 'alien-color-set-1', // rojo
            match: true,
            protan: true
          },
          {
            circle: 'circle-color-set-2', //violeta
            alien: 'alien-color-set-4', // azul
            match: true
          },
          {
            circle: 'circle-color-set-3', // marron oscruro
            alien: 'alien-color-set-2', // amarillo
            match: true
          },
          {
            circle: 'circle-color-set-2',
            repeat: 3
          },
          {
            circle: 'circle-color-set-1',
            repeat: 4,
            deutan: true
          },
          {
            circle: 'circle-color-set-3',
            repeat: 2,
            protan: true
          }
        ]
      },{
        name: 'color-set-2',
        grid: {
          x: 6,
          y: 4
          //24
        },
        time: 15,
        result: Object.assign(_.cloneDeep(vm.emptyResult),{
          name: 'color-set-2',
        }),
        circles: [
           {
            circle: 'circle-color-set-1', //amarelo
            alien: 'alien-color-set-1', //rojo
            match: true,
            repeat: 2,
            deutan: true
          },
          {
            circle: 'circle-color-set-2', //violeta
            alien: 'alien-color-set-2', //amarillo
            match: true
          },
          {
            circle: 'circle-color-set-1',//amarelo
            alien: 'alien-color-set-3', //piel
            match: true,
            repeat: 2,
            deutan: true
          },
          {
            circle: 'circle-color-set-3', // marron oscruro
            alien: 'alien-color-set-1', // rojo
            match: true,
            protan: true
          },
          {
            circle: 'circle-color-set-2', //violeta
            alien: 'alien-color-set-4', // azul
            match: true,
            repeat: 2
          },
          {
            circle: 'circle-color-set-3', // marron oscruro
            alien: 'alien-color-set-2', // amarillo
            match: true
          },
          {
            circle: 'circle-color-set-2',
            repeat: 2
          },
          {
            circle: 'circle-color-set-1',
            repeat: 4,
            deutan: true
          },
          {
            circle: 'circle-color-set-3',
            repeat: 3,
            protan: true
          }
        ]
      },{
        name: 'color-set-3',
        time: 20,
        grid: {
          x: 8,
          y: 5
          //40
          // 10 se ven
          // 8 no se ven
        },
        result: Object.assign(_.cloneDeep(vm.emptyResult),{
          name: 'color-set-3',
        }),
        circles: [
          {
            circle: 'circle-color-set-1', //amarelo
            alien: 'alien-color-set-1', //rojo
            match: true,
            repeat: 3,
            deutan: true
          },
          {
            circle: 'circle-color-set-2', //violeta
            alien: 'alien-color-set-2', //amarillo
            match: true,
            repeat: 3
          },
          {
            circle: 'circle-color-set-1',//amarelo
            alien: 'alien-color-set-3', //piel
            match: true,
            repeat: 3,
            deutan: true
          },
          {
            circle: 'circle-color-set-3', // marron oscruro
            alien: 'alien-color-set-1', // rojo
            match: true,
            repeat: 4,
            protan: true
          },
          {
            circle: 'circle-color-set-2', //violeta
            alien: 'alien-color-set-4', // azul
            match: true,
            repeat: 3
          },
          {
            circle: 'circle-color-set-3', // marron oscruro
            alien: 'alien-color-set-2', // amarillo
            match: true,
            repeat: 4
          },
          {
            circle: 'circle-color-set-2',
            repeat: 8
          },
          {
            circle: 'circle-color-set-1',
            repeat: 7,
            deutan: true
          },
          {
            circle: 'circle-color-set-3',
            repeat: 5,
            protan: true
          }
        ]
      }
    ];

    vm.circleClick = circleClick;
    vm.statusBar = {
      currentMessage: vm.instructionsMessage,
      timeLeft: '00:10'
    }
    vm.enableGame;

    $scope.$on('$viewContentLoaded', function(){
      init();
    });

    function init() {
      vm.enableGame = false;
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
          isProtan: item.protan ? true : false,
          isDeutan: item.deutan ? true : false,
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
      $scope.$apply(function() {
        vm.enableGame = true;
      })

      vm.gameInterval = setInterval(function() {
        if(vm.timeLeft <= 0) {
          if(vm.currentColorSetIndex < 2) {
            vm.enableGame = false;
            finishColorSet();
          } else {
            vm.enableGame = false;
            finishGame()
          }
        } else {
          setStatusBarTimeLeft(vm.timeLeft);
        }
        vm.timeLeft--;
      }, 1000);

    }

    function calculateResults() {
      _.each(vm.grid, function(item) {
        if(item.isDeutan) {
          var itemDeutanResult = 0;
          if(item.isAlien) {
            itemDeutanResult+= item.alreadyClicked ? -1 : 1;
          } else {
            itemDeutanResult+= item.alreadyClicked ? 1 : 0;
          }
          vm.colorSets[vm.currentColorSetIndex].result.deutan+= itemDeutanResult;
        }
        if(item.isProtan) {
          var itemProtanResult = 0;
          if(item.isAlien) {
            itemProtanResult+= item.alreadyClicked ? -1 : 1;
          } else {
            itemProtanResult+= item.alreadyClicked ? 1 : 0;
          }
          vm.colorSets[vm.currentColorSetIndex].result.protan+= itemProtanResult;
        }
      });
    }

    function finishColorSet() {
      clearInterval(vm.gameInterval);
      setStatusBarTimeLeft(0);
      setStatusBarMessage(vm.instructionsMessage);
      vm.colorSets[vm.currentColorSetIndex].result.total = _.reduce(vm.colorSets[vm.currentColorSetIndex].circles, function(sum,n) {
        return sum + (n.match ? n.repeat || 1 : 0)
      }, 0);
      calculateResults();
      resultService.setResult('aliens', vm.colorSets[vm.currentColorSetIndex].name, _.cloneDeep(vm.colorSets[vm.currentColorSetIndex].result));
      vm.colorSets[vm.currentColorSetIndex].result = Object.assign(_.cloneDeep(vm.emptyResult), { name: vm.colorSets[vm.currentColorSetIndex].result.name });
      vm.currentColorSetIndex++;
      vm.grid = [];
      init();
      vm.timeLeft = vm.colorSets[vm.currentColorSetIndex].time;
    }

    function finishGame() {
      clearInterval(vm.gameInterval);
      setStatusBarTimeLeft(0);
      setStatusBarMessage(vm.finishMessage);
      vm.colorSets[vm.currentColorSetIndex].result.total = _.reduce(vm.colorSets[vm.currentColorSetIndex].circles, function(sum,n) {
        return sum + (n.match ? n.repeat || 1 : 0)
      }, 0);
      resultService.setResult('aliens', vm.colorSets[vm.currentColorSetIndex].name, _.cloneDeep(vm.colorSets[vm.currentColorSetIndex].result));
      resultService.finishGame();
      setTimeout(function() {
        $state.go('video', {
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
      soundService.play('button-click');
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
