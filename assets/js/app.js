var app = angular.module("app", [
    'ui.router'
]);

app.config(routeConfig);

routeConfig.$inject=['$locationProvider','$urlRouterProvider'];

/* @ngInject */
function routeConfig($locationProvider, $urlRouterProvider) {
    //location default should have !
    $locationProvider.hashPrefix('!');
        
    //all default to / - home state
    $urlRouterProvider.otherwise('/');
}

app.config(stateConfig);

stateConfig.$inject=['$stateProvider']

function stateConfig($stateProvider) {
    $stateProvider
        .state("colorpicker", {
            url: '/color-picker',
            templateUrl : "/partials/color-picker.html",
            controller: 'colorPickerController',
            controllerAs: 'vm'
        })
        .state("stars", {
            url: '/stars',
            templateUrl : "/partials/stars.html",
            controller: 'starsSpottingController',
            controllerAs: 'vm'
        })
        .state("aliens", {
            url: '/aliens',
            templateUrl : "/partials/aliens.html",
            controller: 'aliensController',
            controllerAs: 'vm'
        })
        .state("intro", {
            url: '/intro',
            templateUrl :  "/partials/intro.html",
            controller: 'introController',
            controllerAs: 'vm',
            params: {
                state: null
            }
        })
        .state('index', {
            url: '/',
            template : "",
            controller: 'indexController',
        });
};