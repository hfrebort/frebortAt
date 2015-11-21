'use strict';

angular.module('itnm', ['ngRoute', 'firebase'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl:'views/home.html'
      })
      .when('/leistungen', {
        templateUrl:'views/leistungen.html'
      })
      .when('/referenzen', {
        controller:'ProjectController',
        templateUrl:'views/referenzen.html'
      })
      .when('/kontakt', {
        controller:'ContactFormController',
        templateUrl:'views/kontakt.html'
      })
      .when('/impressum', {
        templateUrl:'views/impressum.html'
      })
      .when('/team', {
        templateUrl:'views/team.html'
      })
      .when('/haftungsausschluss', {
        templateUrl:'views/haftungsausschluss.html'
      })
      .otherwise({
        redirectTo:'/'
      });
  })
  .controller('ContactFormController', function ($scope, $http) {
    $scope.resetContactRequest = function () {
      $scope.name = '';
      $scope.email = '';
      $scope.message = '';
      $scope.response = '';
    };

    (function() {
      $scope.resetContactRequest();
    })();

    $scope.sendContactMessage = function () {
      var contactRequest = { contactRequest: [$scope.name, $scope.email, $scope.message]};
      $http.post('/kontakt', contactRequest)
        .success(function (data) {
          console.info("kontakt sent: " + data);
          $scope.success = true;
          $scope.resetContactRequest();
          $scope.response = 'Danke f&uuml;r Ihre Nachricht.';
        })
        .error(function (data, error) {
          $scope.success = false;
          $scope.resetContactRequest();
          $scope.response = 'Die Nachricht konnte leider nicht versandt werden. Bitte versuchen Sie es zu einem sp&auml;tern Zeitpunkt nochmals.';
          console.info("kontakt not sent " + error);
        });
    };
  })
  .controller('ProjectController', function ($scope) {
    $scope.projects = [
      {url: 'http://www.kuchlerhaus.at', name: 'Kuchlerhaus GmbH', description: 'Webauftritt für das Unternehmen Kuchlerhaus', imageName: 'images/referenzen/kuchlerhaus.jpg'},
      {url: 'http://reinigung.schneeservicewien.at', name:'Gebäudereinigung Wien West', description: 'Webauftritt Gebäudereinigung Wien West', imageName: 'images/referenzen/reinigung.jpg'},
      {url: 'http://gartenpflege.schneeservicewien.at', name:'Gartenpflege Wien West', description: 'Webauftritt des Unternehmens Gartenpflege Wien West', imageName: 'images/referenzen/gartenpflege.jpg'},
      {url: 'http://www.dialogica.at', name:'Dialogica Europa-Akademie Wien', description: 'Webauftritt von "DIALOGICA Europa-Akademie Wien"', imageName: 'images/referenzen/dialogica.jpg'},
      {url: 'http://www.schneeservicewien.at', name:'Schneeservice Wien West', description: 'Webauftritt des Unternehmens Schneeservice Wien West', imageName: 'images/referenzen/schneeservice.jpg', slogan: 'Wo wir sind, wächst kein Schnee mehr!'},
      {url: '', name:'Katona Service', description: 'Webauftritt von Katona Service', imageName: 'images/referenzen/katonaservice.jpg'},
    ];
  })
  .directive('hfContact', function ($firebaseArray) {
    return {
      restrict : 'A',
      replace : true,
      templateUrl : 'template/hfContact.html',
      link : function (scope, attributes) {
        var fbReference = attributes.url || 'https://popping-fire-9893.firebaseio.com/frebortAtMessages';
        var fbInstance = new Firebase(fbReference);
        scope.messages = $firebaseArray(fbInstance);
        scope.requestMessage = {};
        scope.addNew = function () {
          scope.messages.$add(scope.requestMessage).then(function () {
            scope.requestMessage = {};
          });
        };
      }
    };
  });
  