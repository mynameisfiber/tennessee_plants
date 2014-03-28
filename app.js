(function (angular) {

	var ctrl = {};
	
	ctrl.mainCtrl = function ($scope, $http) {

		var heightParse = function (height) {
			var val = parseFloat(height);
			if (isNaN(val)) { val = 1e8; }
			return val;
		};

		$scope.cols = [
			{ id: "common_name", title: "Common Name" },
			{ id: "scientific_name", title: "Scientific Name" },
			{ id: "native_region", title: "Region" },
			{ id: "light_preference", title: "Light" },
			{ id: "bloom_time", title: "Bloom Time" },
			{ id: "evergreen", title: "Evergreen" },
			{ id: "moisture_conditions", title: "Moisture" },
			{ id: "soil_ph", title: "PH" },
			{ id: "wildlife_value", title: "Wildlife" },
			{ id: "comments", title: "Comments" },
			{ id: "height_min", title: "Min Height", sortFn: heightParse },
			{ id: "height_max", title: "Max Height", sortFn: heightParse },
			{ id: "picture", title: "" }
		];
		$scope.reverse = false;
		$scope.sortCol = 0;
		$scope.sortBy = function (plant) {
			if (!plant) { return false; }
			var col = $scope.cols[$scope.sortCol];
			var colData = plant[col.id];
			return col.sortFn ? col.sortFn(colData) : colData;
		};

		$scope.sortClick = function (index) {
			$scope.reverse = !$scope.reverse;
			$scope.sortCol = index;
		};

		$scope.arrows = function (index) {
			if (index !== $scope.sortCol) { return {}; }
			return {
				fa: true,
				'fa-sort-up': !$scope.reverse,
				'fa-sort-down': $scope.reverse
			};
		};

		$scope.currentPic = '';
			$scope.setPic = function (url) {
			$scope.currentPic = url;
		};

		$http.get('plant_data.json').then(function (response) {
			$scope.plants = response.data;
		});
	};

	var dir = {};

	dir.centered = function () {
		return {
			restrict : "E",
			transclude : true,
			template : '<div class="angular-centered" ng-transclude></div>'
		};
	};

	angular.module("plantApp", ['ngSanitize'])
		.controller(ctrl)
		.directive(dir);

}(window.angular));