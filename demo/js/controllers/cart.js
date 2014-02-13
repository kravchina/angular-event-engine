
demoApplication.controller('CartCtrl', ['$scope', '$eventEngine', function ($scope, $eventEngine) {
	$scope.total = 0;

	$eventEngine.listen('cart.item.added', function(item){
	    $scope.total += item.price;
	});

	$eventEngine.listen('cart.item.removed', function(item){
	    $scope.total -= item.price;
	});
}]);