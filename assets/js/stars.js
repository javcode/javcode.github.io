(function () {
  'use strict';
  angular.module('app')
    .controller('starsSpottingController', function ($scope, $state, $q, $timeout) {
      var vm = this;

      var flexVerticalPositions = ['center', 'flex-end', 'end'];
      var flexHorizontalPositions = ['center', 'flex-end', 'flex-start'];

      vm.grid = {
        dimensions: {
          x: 15,
          y: 10
        },
        circles: 20,
        stars: 10,
        items: []
      }

      vm.statusBar = {
        currentMessage: ''
      }
      vm.currentColorSetIndex = 0;
      vm.currentColorSet = vm.colorSets[vm.currentColorSetIndex]

      vm.colorSets = [
        {
          name: 'color-set-1',
          colors: [
            'star-color-set-1',
            'star-color-set-2',
            'star-color-set-3',
          ]
        },
        {
          name: 'color-set-2',
          colors: [
            'star-color-set-1',
            'star-color-set-2',
            'star-color-set-3',
          ]
        },
        {
          name: 'color-set-3',
          colors: [
            'star-color-set-1',
            'star-color-set-2',
            'star-color-set-3',
          ]
        }
      ]

      function init() {
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
        generate(_.shuffle(itemList), divWidth, divHeight);
      }


      init();

      function generate(itemList, divWidth, divHeight) {
        for(var i = 0; i < itemList.length; i++) {
          var item = itemList[i];
          var newItem = {
            type: item,
            colorClass: '',
            hAlign: _.sample(flexHorizontalPositions),
            vAlign: _.sample(flexVerticalPositions),
            width: divWidth,
            height: divHeight
          }
          vm.grid.items.push(newItem);
        }
      }

      function setStatusBarMessage(newMessage) {
        $scope.$evalAsync(function(scope) {
          scope.vm.statusBar.currentMessage = newMessage;
        });
      }
    });
})();