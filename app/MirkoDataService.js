(function () {
  'use strict';

  angular
    .module('mirko')
    .service('MirkoDataService', MirkoDataService);

  function MirkoDataService($http) {
    return {
      getTopTags: getTopTags,
      makeCustomRequest: makeCustomRequest
    };

    function getTopTags() {
      return $http({
        method: "GET",
        url: "http://a.wykop.pl/tags/index/appkey," + APPKEY,
        headers: {"apisign": md5(SECRET + "http://a.wykop.pl/tags/index/appkey," + APPKEY)}
      })
    }

    function makeCustomRequest(request, apisign) {
      return $http({
        method: "GET",
        url: request,
        headers: {"apisign": apisign}
      })
    }
  }
})();