(function () {
  'use strict';
  angular.module('app')
    .controller('colorPickerController', colorPickerController);

  colorPickerController.$inject = ['$scope', '$state', '$q', '$timeout', 'resultService'];

  function colorPickerController($scope, $state, $q, $timeout, resultService) {
      var vm = this;

      vm.enableColorPickerGame = false; // Enable after playing instructions
      vm.buttonsList = [];
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

      vm.buttonTypes = [
        'square',
        'circle',
        'triangle'
      ];

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
        currentMessage: 'Test'
      }
      vm.interGameMessage = '00:00'
      vm.gameFinishedMessage = '00:00'

      $scope.$on('$viewContentLoaded', function() {
        createButtonColumns();
        playInstructions()
          .then(function() { startColorPickerGame(true) })
          .catch(console.error);
      });


      function playInstructions() {
        var deferred = $q.defer();
        $timeout(function() {
          deferred.resolve(true);
        }, 5000);

        return deferred.promise;
      }

      function setStatusBarMessage(newMessage) {
        $scope.$evalAsync(function(scope) {
          scope.vm.statusBar.currentMessage = newMessage;
        });
      }

      function startColorPickerGame(zoomToPanel) {
        if(zoomToPanel) {
          $('.tablero-columnas .tablero-columna-panel:nth-child(3) .icon:nth-child(3)').zoomTo({targetsize:0.12});
        }
        resultService.startGame();
        vm.enableColorPickerGame = true;
        vm.timeLeft = 5;
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
          vm.gameSets[vm.currentGameSetIndex].result = _.clone(vm.colorSets);
          resultService.setResult('color-picker', vm.currentGameSetIndex, vm.gameSets[vm.currentGameSetIndex].result);
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
            $state.go('intro', {
              state:  'second'
            });
          }
        });
        console.log('GAME FINISHED');
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
        var itemSelection = _.find(vm.colorSets, { name: item.colorSet });
        itemSelection.value = itemSelection.target == $index;
      }

    };
})();