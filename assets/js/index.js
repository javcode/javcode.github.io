(function () {
  'use strict';
  angular.module('app').controller('indexController', indexController);

  indexController.$inject = ['$scope', '$state'];
  
  function indexController ($scope, $state) {
    var vm = this;

    $scope.$on('$viewContentLoaded', function(){
      $state.go('intro', {
        state:  'first'
      })
    });
  }

})();
