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
        .state("video", {
            url: '/video',
            templateUrl :  "/partials/video.html",
            controller: 'videoController',
            controllerAs: 'vm',
            params: {
                state: null
            }
        })
        .state('menu', {
            url: '/menu',
            templateUrl :  "/partials/menu.html"
        })
        .state('results', {
            url: '/results',
            templateUrl :  "/partials/results.html",
            controller: 'resultsController',
            controllerAs: 'vm',
        })
        .state('index', {
            url: '/',
            template : "",
            controller: 'indexController',
        });
};