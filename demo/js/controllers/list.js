
demoApplication.controller('ListCtrl', ['$scope', '$eventEngine', function ($scope, $eventEngine) {
    $scope.items = [];

    $scope.RemoveAll = function () {
        $eventEngine.dispatch('cart.item.remove.all');
    };

    $eventEngine.listen('cart.item.added', function (item) {
        $scope.items.push(item);
    });

    $eventEngine.listen('cart.item.remove.all', function (item) {
        $scope.items = [];
    });

    $eventEngine.listen('cart.item.removed', function (item) {
        var index = -1;

        for (var i = 0 ; i < $scope.items.length ; i++) {
            if ($scope.items[i].id === item.id) {
                index = i;
                break;
            }
        }

        if (index > -1) {
            $scope.items.splice(index, 1);
        }
    });
}]);