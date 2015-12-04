// service (/services/auth.js): add a listUsers function here that will retrieve your list of users from firebase
// controller (/services/todoner.js): use this instead of AuthController (call it TodonerController), and retrieve 
// the toDoners on controller load.  Add the retrieved toDoners to $scope.todoners and pass it to the html to print

'use strict';

app.controller('TodonersController', function($scope, $location, toaster, Auth) {
	$scope.getUsers = listUsers;
	
});