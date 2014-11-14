angular.module('baseApp.controllers', ['baseApp.services'])
 
.controller('SignInCtrl', function ($rootScope, $scope, API, $window) {
    // if the user is already logged in, take him to his base app
    if ($rootScope.isSessionActive()) {
        $window.location.href = ('#/base/list');
    }
 
    $scope.user = {
        cellphone: "",
        password: ""
    };
 
    $scope.validateUser = function () {
        var cellphone = this.user.cellphone;
        var password = this.user.password;
        if(!cellphone || !password) {
            $rootScope.notify("Please enter valid credentials");
            return false;
        }
        $rootScope.show('Please wait.. Authenticating');
        API.signin({
            cellphone: cellphone,
            password: password
        }).success(function (data) {
            $rootScope.setToken(cellphone); // create a session kind of thing on the client side
            $rootScope.hide();
            $window.location.href = ('#/base/list');
        }).error(function (error) {
            $rootScope.hide();
            $rootScope.notify("Invalid Username or password");
        });
    }
 
})
 
.controller('SignUpCtrl', function ($rootScope, $scope, API, $window) {
    $scope.user = {
        cellphone: "",
        password: "",
        name: ""
    };
 
    $scope.createUser = function () {
        var cellphone = this.user.cellphone;
        var password = this.user.password;
        var uName = this.user.name;
        if(!cellphone || !password || !uName) {
            $rootScope.notify("Please enter valid data");
            return false;
        }
        $rootScope.show('Please wait.. Registering');
        API.signup({
            cellphone: cellphone,
            password: password,
            name: uName
        }).success(function (data) {
            $rootScope.setToken(cellphone); // create a session kind of thing on the client side
            $rootScope.hide();
            $window.location.href = ('#/base/list');
        }).error(function (error) {
            $rootScope.hide();
            if(error.error && error.error.code == 11000)
            {
                $rootScope.notify("A user with this cellphone already exists");
            }
            else
            {
                $rootScope.notify("Oops something went wrong, Please try again!");
            }
            
        });
    }
})
 
.controller('myListCtrl', function ($rootScope, $scope, API, $timeout, $ionicModal, $window) {
    $rootScope.$on('fetchAll', function(){
            API.getAll($rootScope.getToken()).success(function (data, status, headers, config) {
            $rootScope.show("Please wait... Processing");
            $scope.list = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].isCompleted == false) {
                    $scope.list.push(data[i]);
                }
            };
            if($scope.list.length == 0)
            {
                $scope.noData = true;
            }
            else
            {
                $scope.noData = false;
            }
 
            $ionicModal.fromTemplateUrl('templates/newItem.html', function (modal) {
                $scope.newTemplate = modal;
            });
 
            $scope.newTask = function () {
                $scope.newTemplate.show();
            };
            $rootScope.hide();
        }).error(function (data, status, headers, config) {
            $rootScope.hide();
            $rootScope.notify("Oops something went wrong!! Please try again later");
        });
    });
 
    $rootScope.$broadcast('fetchAll');
 
    $scope.markCompleted = function (id) {
        $rootScope.show("Please wait... Updating List");
        API.putItem(id, {
            isCompleted: true
        }, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(1);
            }).error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };
 
 
 
    $scope.deleteItem = function (id) {
        $rootScope.show("Please wait... Deleting from List");
        API.deleteItem(id, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(1);
            }).error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };
 
})
 
.controller('completedCtrl', function ($rootScope,$scope, API, $window) {
    $rootScope.$on('fetchCompleted', function () {
        API.getAll($rootScope.getToken()).success(function (data, status, headers, config) {
            $scope.list = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].isCompleted == true) {
                    $scope.list.push(data[i]);
                }
            };
            if(data.length > 0 & $scope.list.length == 0)
            {
                $scope.incomplete = true;
            }
            else
            {
                $scope.incomplete= false;
            }

            if(data.length == 0)
            {
                $scope.noData = true;
            }
            else
            {
                $scope.noData = false;
            }
        }).error(function (data, status, headers, config) {
            $rootScope.notify("Oops something went wrong!! Please try again later");
        });

    });

    $rootScope.$broadcast('fetchCompleted');
    $scope.deleteItem = function (id) {
        $rootScope.show("Please wait... Deleting from List");
        API.deleteItem(id, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(2);
            }).error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };
})
 
.controller('newCtrl', function ($rootScope, $scope, API, $window) {
    $scope.data = {
        item: ""
    };

    $scope.close = function () {
        $scope.modal.hide();
    };

    $scope.createNew = function () {
        var item = this.data.item;
        if (!item) return;
        $scope.modal.hide();
        $rootScope.show();

        $rootScope.show("Please wait... Creating new");

        var form = {
            item: item,
            isCompleted: false,
            user: $rootScope.getToken(),
            created: Date.now(),
            updated: Date.now()
        }

        API.saveItem(form, form.user)
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(1);
            })
            .error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };
})