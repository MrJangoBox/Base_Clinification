angular.module('clinifApp', ['ionic', 'clinifApp.controllers', 'clinifApp.services'])
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('auth', {
                url: "/auth",
                abstract: true,
                templateUrl: "templates/auth.html"
            })
            .state('auth.signin', {
                url: '/signin',
                views: {
                    'auth-signin': {
                        templateUrl: 'templates/auth-signin.html',
                        controller: 'SignInCtrl'
                    }
                }
            })
            .state('auth.signup', {
                url: '/signup',
                views: {
                    'auth-signup': {
                        templateUrl: 'templates/auth-signup.html',
                        controller: 'SignUpCtrl'
                    }
                }
            })
            .state('clinif', {
                url: "/clinif",
                abstract: true,
                templateUrl: "templates/clinif.html"
            })
            .state('clinif.list', {
                url: '/list',
                views: {
                    'clinif-list': {
                        templateUrl: 'templates/clinif-list.html',
                        controller: 'myListCtrl'
                    }
                }
            })
            .state('clinif.completed', {
                url: '/completed',
                views: {
                    'clinif-completed': {
                        templateUrl: 'templates/clinif-completed.html',
                        controller: 'completedCtrl'
                    }
                }
            })
            .state('menu', {
                url: "/menu",
                abstract: true,
                templateUrl: "templates/menu.html"
            })
            .state('menu.profile', {
                url: '/profile',
                views: {
                    'menu-profile': {
                        templateUrl: 'templates/menu-profile.html',
                        controller: 'myProfileCtrl'
                    }
                }
            })
            .state('menu.contact', {
                url: '/contact',
                views: {
                    'menu-contact': {
                        templateUrl: 'templates/menu-contact.html',
                        controller: 'myContactCtrl'
                    }
                }
            })
        $urlRouterProvider.otherwise('/auth/signin');
    });