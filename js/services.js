angular.module('baseApp.services', [])

.factory('API', function ($rootScope, $http, $ionicLoading, $window) {
//    var base = "http://localhost:9804";
    var base = "http://clinificationappserver.herokuapp.com";
    $rootScope.show = function (text) {
        $rootScope.loading = $ionicLoading.show({
            content: text ? text : 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
    };

    $rootScope.hide = function () {
        $ionicLoading.hide();
    };

    $rootScope.logout = function () {
        $rootScope.setToken("");
        $window.location.href = '#/auth/signin';
    };

    $rootScope.notify =function(text){
        $rootScope.show(text);
        $window.setTimeout(function () {
          $rootScope.hide();
        }, 1999);
    };

    $rootScope.doRefresh = function (tab) {
        if(tab == 1)
            $rootScope.$broadcast('fetchAll');
        else
            $rootScope.$broadcast('fetchCompleted');

        $rootScope.$broadcast('scroll.refreshComplete');
    };

    $rootScope.setToken = function (token) {
        return $window.localStorage.token = token;
    }

    $rootScope.getToken = function () {
        return $window.localStorage.token;
    }

    $rootScope.isSessionActive = function () {
        return $window.localStorage.token ? true : false;
    }

    return {
        signin: function (form) {
            return $http.post(base+'/api/v1/baseApp/auth/login', form);
        },
        signup: function (form) {
            return $http.post(base+'/api/v1/baseApp/auth/register', form);
        },
        getAll: function (cellphone) {
            return $http.get(base+'/api/v1/baseApp/data/list', {
                method: 'GET',
                params: {
                    token: cellphone
                }
            });
        },
        getOne: function (id, cellphone) {
            return $http.get(base+'/api/v1/baseApp/data/item/' + id, {
                method: 'GET',
                params: {
                    token: cellphone
                }
            });
        },
        saveItem: function (form, cellphone) {
            return $http.post(base+'/api/v1/baseApp/data/item', form, {
                method: 'POST',
                params: {
                    token: cellphone
                }
            });
        },
        putItem: function (id, form, cellphone) {
            return $http.put(base+'/api/v1/baseApp/data/item/' + id, form, {
                method: 'PUT',
                params: {
                    token: cellphone
                }
            });
        },
        deleteItem: function (id, cellphone) {
            return $http.delete(base+'/api/v1/baseApp/data/item/' + id, {
                method: 'DELETE',
                params: {
                    token: cellphone
                }
            });
        }
    }
});