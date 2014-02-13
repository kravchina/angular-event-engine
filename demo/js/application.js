var demoApplication = angular.module('DemoApplication', ['ui.router', 'event.engine']);

demoApplication.config(['$stateProvider', '$urlRouterProvider', '$eventEngineProvider', function ($stateProvider, $urlRouterProvider, $eventEngineProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home', {
            url: '/home',
            views: {
                'content': { templateUrl: 'js/views/content.html', controller: 'ContentCtrl' },
                'cart': { templateUrl: 'js/views/cart.html', controller: 'CartCtrl' },
                'list': { templateUrl: 'js/views/list.html', controller: 'ListCtrl' },
                'popular': { templateUrl: 'js/views/popular.html', controller: 'PopularCtrl' }
            }
        });

    $eventEngineProvider.setConfig({
        catchExceptions: true
    });
}]);

demoApplication.factory('$fakeRepository', function () {
    return {
        'getItems': function (fn) {
            fn([{
                'id': 1,
                'name': 'First element',
                'price': 1.6
            }, {
                'id': 2,
                'name': 'Second element',
                'price': 1.6
            }, {
                'id': 3,
                'name': 'Third element',
                'price': 1.6
            }]);
        },
        'getPopularItems': function (fn) {
            fn([{
                'id': 1,
                'name': 'First element',
                'price': 1.6
            }, {
                'id': 4,
                'name': 'Fourth element',
                'price': 1.6
            }, {
                'id': 5,
                'name': 'Fifth element',
                'price': 1.6
            }]);
        }
    };
});