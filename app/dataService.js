(function(){
    "use strict";
    angular.module('ccbdManageApp')
        .factory('dataService', function ($http) {
            return {
                getStatus: getStatus,
                update: update
            };
            function getStatus(url){
                let url_done = 'https://' + url + '/socket.php';
                return $http({
                    method: 'POST',
                    url: url_done,
                    data: {data: "Get"},
                    headers: {}
                });
            }
            function update(url, data){
                let url_done = 'https://' + url + '/socket.php';
                return $http({
                    method: 'POST',
                    url: url_done,
                    data: data,
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }
        });
})();
