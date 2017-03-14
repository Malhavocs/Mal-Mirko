(function () {
  'use strict';

  angular
    .module('mirko')
    .controller('SearchBarController', SearchBarController);

  SearchBarController.$inject = ["$scope", "$window", "MirkoDataService"];

  function SearchBarController($scope, $window, MirkoDataService) {

    var counter = 1;

    $scope.posts = [];

    $scope.validate = function (tag) {
      var polishSigns = ['ą', 'ę', 'ó', 'ż', 'ź', 'ć', 'ś', 'ń', 'ł', '#'];

      var characters = tag.split('');

      var isValid = true;


      for(var i = 0; i <= characters.length; i++) {
        if(polishSigns.indexOf(characters[i]) >= 0) {
          isValid = false;
        }
      }

      if(!isValid) {
        alert("Polish and # signs are prohibited!");
        $scope.tag = '';
      }
    };

    $scope.openUrl = function(url) {
      $window.open(url);
      };

    $scope.loadTopTags = function () {

      MirkoDataService.getTopTags()
        .then
          (function (response) {
            $scope.tags = response.data
          },
          function (response){
            alert('Server error');
      });
    };

    $scope.searchTag = function () {

      counter = 1;

      $scope.posts.splice(0);

      var request = "http://a.wykop.pl/tag/index/" + $scope.tag + "/appkey," + APPKEY + ",page," + counter;

      var apisign = md5(SECRET + request);

      MirkoDataService.makeCustomRequest(request, apisign)
        .then
          (function (response) {
            if (response.data.items) {

              var newContent = response.data.items.filter(function(element) {
                return element.embed;
              });

              if (newContent.length > 0) {
                $scope.posts = $scope.posts.concat(newContent);
              } else {
                alert('There\'s no content for this tag.');
              }
            }
          },
          function (response){
            alert('Server error');
          });

    };

    $scope.loadMore = function () {

      counter += 1;

      var request = "http://a.wykop.pl/tag/index/" + $scope.tag + "/appkey," + APPKEY + ",page," + counter;

      var apisign = md5(SECRET + request);

      MirkoDataService.makeCustomRequest(request, apisign)
        .then
          (function (response) {
              if (response.data.items) {
  
              var newContent = response.data.items.filter(function(element) {
                return element.embed;
              });

              if (newContent.length > 0) {
                $scope.posts = $scope.posts.concat(newContent);
              } else {
                alert('There\'s no more content for this tag.');
              }
            }
          },
          function (response){
            alert('Server error');
          });
    };
  }
})();
