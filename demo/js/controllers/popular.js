
demoApplication.controller('PopularCtrl', ['$scope', '$eventEngine', '$fakeRepository', function ($scope, $eventEngine, $fakeRepository) {

    $fakeRepository.getPopularItems(function (items) {
        $scope.items = items;
    });

    $scope.AddToCart = function (item) {
        $eventEngine.dispatch('cart.item.added', angular.copy(item));
    }

    $scope.RemoveFromCart = function (item) {
        $eventEngine.dispatch('cart.item.removed', angular.copy(item));
    }

    $eventEngine.listen('cart.item.added', function (item) {
        var target = _.findWhere($scope.items, { 'id': item.id });

        if (target != undefined)
            target.isAdded = true;
    });

    $eventEngine.listen('cart.item.removed', function (item) {
        var target = _.findWhere($scope.items, { 'id': item.id });

        if (target != undefined)
            target.isAdded = false;
    });

    $eventEngine.listen('cart.item.remove.all', function (item) {
        _.each($scope.items, function (item) {
            item.isAdded = false;
        });
    });
}]);