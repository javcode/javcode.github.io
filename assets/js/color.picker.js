(function () {
  'use strict';
  angular.module('app')
    .controller('colorPickerController', colorPickerController);

  colorPickerController.$inject = ['$scope', '$state', '$q', '$timeout', 'resultService', 'soundService'];

  function colorPickerController($scope, $state, $q, $timeout, resultService, soundService) {
      var vm = this;

      vm.gameTime = 10;
      vm.enableColorPickerGame = false; // Enable after playing instructions
      vm.buttonsList = [];
      vm.buttonTypes = [
        'square',
        'circle',
        'triangle'
      ];
      vm.gameSets = [
        {
          name: 'game-color-picker-1'
        },
        {
          name: 'game-color-picker-2'
        },
        {
          name: 'game-color-picker-3'
        }
      ];

      vm.currentGameSetIndex = 0;
      vm.currentGameSet = vm.gameSets[vm.currentGameSetIndex];

      vm.colorBlindDetermination = {
        'game-color-picker-1': {
          'deutan': [
            'color-set-1',
            'color-set-2',
            'color-set-3'
          ]
        },
        'game-color-picker-2': {
          'deutan': [
            'color-set-1'
          ]
        },
        'game-color-picker-3': {
          'protan': [
            'color-set-1',
            'color-set-3'
          ]
        }
      }


      vm.colorSets = [
        {
          name: 'color-set-1',
          shift: 0,
          target: 2,
          value: -1
        },
        {
          name: 'color-set-2',
          shift: 1,
          target: 0,
          value: -1
        },
        {
          name: 'color-set-3',
          shift: 2,
          target: 1,
          value: -1
        }
      ];


      vm.clickButton = clickButton;
      vm.statusBar = {
        currentMessage: 'Iniciando'
      }
      vm.interGameMessage = 'Una vez más'
      vm.gameFinishedMessage = 'Bien hecho'

      $scope.$on('$viewContentLoaded', function() {
        vm.enableColorPickerGame = false;
        createButtonColumns();
        playInstructions()
          .then(function() { resultService.startGame('color-picker'); })
          .then(function() { startColorPickerGame(true) })
          .catch(console.error);
      });


      function playInstructions() {
        var deferred = $q.defer();

        $timeout(function() {
          deferred.resolve(true);
        }, 4000);

        return deferred.promise;
      }

      function setStatusBarMessage(newMessage) {
        $scope.$evalAsync(function(scope) {
          scope.vm.statusBar.currentMessage = newMessage;
        });
      }

      function startColorPickerGame(zoomToPanel) {
        vm.enableColorPickerGame = true;
        setTimeout(function() {
          if(zoomToPanel) {
            $('.tablero-columnas .tablero-columna-panel:nth-child(3) .icon:nth-child(3)').zoomTo({targetsize:0.12});
          }
        });
        vm.timeLeft = vm.gameTime;
        vm.timer = setInterval(function() {
          setStatusBarMessage("00:" + (vm.timeLeft > 9 ? '':'0') + vm.timeLeft);
          vm.timeLeft--;
          checkIfGameIsFinished();
        }, 1000);
      }

      function checkIfGameIsFinished() {
        if(vm.timeLeft < 0) {
          clearInterval(vm.timer);
          vm.enableColorPickerGame = false;
          vm.gameSets[vm.currentGameSetIndex].result = {
            clicks: _.cloneDeep(vm.colorSets)
          }
          _.each(vm.colorSets, function(colorSet) {
            delete colorSet.value;
          })
          var colorBlindDetermination = vm.colorBlindDetermination[vm.gameSets[vm.currentGameSetIndex].name];
          if(colorBlindDetermination.deutan) {
            vm.gameSets[vm.currentGameSetIndex].result.deutan = {
              total: colorBlindDetermination.deutan.length,
              hits: _.reduce(vm.gameSets[vm.currentGameSetIndex].result, function(sum,n) {
                  return sum + (n.value == true && colorBlindDetermination.deutan.includes(n.name) ? 1 : 0);
                }, 0)
            }
          }
          if(colorBlindDetermination.protan) {
            vm.gameSets[vm.currentGameSetIndex].result.protan = {
              total: colorBlindDetermination.protan.length,
              hits: _.reduce(vm.gameSets[vm.currentGameSetIndex].result, function(sum,n) {
                  return sum + (n.value == true && colorBlindDetermination.protan.includes(n.name) ? 1 : 0);
                }, 0)
            }
          }
          resultService.setResult('color-picker', vm.gameSets[vm.currentGameSetIndex].name, vm.gameSets[vm.currentGameSetIndex].result);
          vm.currentGameSetIndex++;
          if(vm.currentGameSetIndex < vm.gameSets.length) {
            setStatusBarMessage(vm.interGameMessage);
            vm.currentGameSet = vm.gameSets[vm.currentGameSetIndex];
            startColorPickerGame();
          } else {
            gameFinished();
          }
        }
      }

      function gameFinished() {
        setStatusBarMessage(vm.gameFinishedMessage);
        $("body").zoomTo({
          targetsize: 1,
          animationendcallback: function() {
            $state.go('video', {
              state:  'estrellas'
            });
          }
        });
      }

      function shiftArrayToRight(arr, places) {
        for (var i = 0; i < places; i++) {
          arr.unshift(arr.pop());
        }
        return arr;
      }

      function createButtonColumns() {
        var result = [];
        _.each(vm.colorSets, function(colorSet) {
          var colorSetButtons = {
            colorSet: colorSet.name,
            buttons: createButtonColumn(colorSet.shift)
          };
          result.push(colorSetButtons);
        })
        vm.buttonsList = result;
      };

      function createButtonColumn(shift) {
        var buttons = [];
        var originalButtonTypesCopy = _.clone(vm.buttonTypes)
        if(shift) {
          buttons = shiftArrayToRight(originalButtonTypesCopy, shift);
        } else {
          buttons = originalButtonTypesCopy;
        }
        return buttons;
      }

      function clickButton(item, $index) {
        soundService.play('button-click');
        var itemSelection = _.find(vm.colorSets, { name: item.colorSet });
        itemSelection.value = itemSelection.target == $index;
      }

    };
})();