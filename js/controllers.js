angular.module('clinifApp.controllers', ['clinifApp.services'])
 
.controller('SignInCtrl', function ($rootScope, $scope, API, $window) {
    // if the user is already logged in, take him to his appointment page
    if ($rootScope.isSessionActive()) {
        $window.location.href = ('#/clinif/list');
    }
 
    $scope.user = {
        username: "",
        password: ""
    };
    
    $rootScope.showMenuButton = function () {
        return "false";
    };
 
    $scope.validateUser = function () {
        var username = this.user.username;
        var password = this.user.password;
        if(!username || !password) {
            $rootScope.notify("Please enter valid credentials");
            return false;
        }
        $rootScope.show('Please wait.. Authenticating');
        API.signin({
            username: username,
            password: password
        }).success(function (data) {
            $rootScope.setToken(username); // creates a session kind of thing on the client side
            $rootScope.hide();
            $window.location.href = ('#/clinif/list');
        }).error(function (error) {
            $rootScope.hide();
            $rootScope.notify("Invalid Username or password");
        });
    }
 
})
 
.controller('SignUpCtrl', function ($rootScope, $scope, API, $window) {
    $scope.user = {
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        accountType: "",
        phoneNumber: "",
        language: ""
    };
    
    $rootScope.showMenuButton = function () {
        return "false";
    };
 
    $scope.createUser = function () {
        var username = this.user.username;
        var password = this.user.password;
        var firstName = this.user.firstName;
        var lastName = this.user.lastName;
        var accountType = this.user.accountType;
        var phoneNumber = this.user.phoneNumber;
        var language = this.user.language;
        if(!username || !password || !language) {
            $rootScope.notify("Please enter valid data");
            return false;
        }
        $rootScope.show('Please wait.. Registering');
        API.signup({
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName,
            accountType: accountType,
            phoneNumber: phoneNumber,
            language: language
        }).success(function (data) {
            $rootScope.setToken(username); // create a session kind of thing on the client side
            $rootScope.hide();
            $window.location.href = ('#/clinif/list');
        }).error(function (error) {
            $rootScope.hide();
            if(error.error && error.error.code == 11000)
            {
                $rootScope.notify("A user with this username already exists");
            }
            else
            {
                $rootScope.notify("Oops something went wrong, Please try again!");
            }
            
        });
    }
})
 
// Appointment list controller
.controller('myListCtrl', function ($rootScope, $scope, API, $timeout, $ionicModal, $window) {
    $rootScope.$on('fetchAll', function(){
        
        $rootScope.showMenuButton = function () {
            return "true";
        };
        
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

// Profile controller
.controller('myProfileCtrl', function ($rootScope, $scope, API, $timeout, $ionicModal, $window) {
    $rootScope.$on('fetchAll', function(){
        
        $rootScope.showMenuButton = function () {
            return "true";
        };
        
        API.getProfileInfo($rootScope.getToken()).success(function (data, status, headers, config) {
            $rootScope.show("Please wait... Processing");
            $scope.profile = [];
            $scope.profile.push(data);
                
            $rootScope.hide();
        }).error(function (data, status, headers, config) {
            $rootScope.hide();
            $rootScope.notify("Oops something went wrong!! Please try again later");
        });
    });
    
    $scope.user = {
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        language: ""
    };
    
    $scope.updateProfile = function () {
        
        var password = this.user.password2;
        var firstName = this.user.firstName2;
        var lastName = this.user.lastName2;
        var phoneNumber = this.user.phoneNumber2;
        var language = this.user.language;
        
        $rootScope.show("Please wait... Updating List");
        API.putProfile({
            password: password,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            language: language
        }, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(1);
            }).error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };
    
    $rootScope.$broadcast('fetchAll');
})

// App index controller
.controller('indexCtrl', function ($rootScope, $scope, API, $timeout, $ionicModal, $window) {
    $rootScope.$on('fetchAll', function(){
        
        API.getAll($rootScope.getToken()).success(function (data, status, headers, config) {
            $rootScope.show("Please wait... Processing");
            $scope.list = [];
            $scope.categoriesLoaded = [];
            for (var i = 0; i < data.length; i++) {
                $scope.categoryExist = false;
                
                numOfCategories = $scope.categoriesLoaded.length;
                console.log(numOfCategories);
                
                if (numOfCategories == 0) {
                        $scope.categoriesLoaded.push(data[i].category);
                        console.log(data[i].category);
                }
                
                for (var j = 0; j < numOfCategories; j++) {    
                    
                    if (data[i].category == $scope.categoriesLoaded[j])
                    {
                        $scope.categoryExist = true;
                    }
                }
                
                if ($scope.categoryExist == false)
                {
                    $scope.list.push(data[i]);
                    $scope.categoriesLoaded.push(data[i].category);
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
 
    $rootScope.selectCategory = function (category) {
                $window.location.href="#/clinif/category"
                $rootScope.category = category
                $scope.$broadcast("$destroy");
            };
    
    $rootScope.toProfile = function () {
                $rootScope.hide();
                $window.location.href = ('#/menu/profile');
//                $scope.$broadcast("$destroy");
            };
    
    $rootScope.$broadcast('fetchAll');
 
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

    $rootScope.showMenuButton = function () {
        return "true";
    };
    
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

// Side-menu controller
.controller('menuCtrl', function ($rootScope, $scope, API, $timeout, $ionicModal, $window) {
    $rootScope.$on('fetchAll', function(){
        
        $rootScope.showMenuButton = function () {
            return "true";
        };
        
        API.getAll($rootScope.getToken()).success(function (data, status, headers, config) {
            $rootScope.show("Please wait... Processing");
            $scope.list = [];
            $scope.categoriesLoaded = [];
            for (var i = 0; i < data.length; i++) {
                $scope.categoryExist = false;
                
                numOfCategories = $scope.categoriesLoaded.length;
                console.log(numOfCategories);
                
                if (numOfCategories == 0) {
                        $scope.categoriesLoaded.push(data[i].category);
                        console.log(data[i].category);
                }
                
                for (var j = 0; j < numOfCategories; j++) {    
                    
                    if (data[i].category == $scope.categoriesLoaded[j])
                    {
                        $scope.categoryExist = true;
                    }
                }
                
                if ($scope.categoryExist == false)
                {
                    $scope.list.push(data[i]);
                    $scope.categoriesLoaded.push(data[i].category);
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
 
    $rootScope.selectCategory = function (category) {
                $window.location.href="#/clinif/category"
                $rootScope.category = category
                $scope.$broadcast("$destroy");
            };
    
    $rootScope.toClinif = function () {
                $window.location.href = ('#/clinif/list');
//                $scope.$broadcast("$destroy");
    }
    
    $rootScope.$broadcast('fetchAll');
 
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