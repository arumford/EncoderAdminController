(function(){
    'use strict';
    let app = angular.module('ccbdManageApp', []);

    app.controller('MainController', function(dataService, $filter){
      let self = this;
      self.encoders = [];
      self.showfilters = false;
      self.filters = {
          status_buttons: true,
          audio_level: true,
          stream_link: false,
          network_info: false,
          update_status: false
      };
      self.openLink = function(url){
          window.open("https://" + url, "_blank");
      };

      self.toggle_filters = function(){
        self.showfilters = !self.showfilters;
      };

      $.getJSON("server.json", function(data){
        $.each(data, function(index, value){
          dataService.getStatus(value.url)
              .then(function(data){
                let encoder = {
                  name: value.name,
                  data: data.data,
                  url: value.url
                };
                self.encoders.push(encoder);
              }, function(error){
                console.log(error);
                let encoder = {
                    name: value.name,
                    url: value.url,
                    error: true
                };
                self.encoders.push(encoder);
                self.encoders = $filter('orderBy')(self.encoders, 'name');
              });
          });
        });

      self.update = function(encoder, input){
        dataService.update(encoder.url, JSON.stringify({data: input})).then(
            function(data){
              $.each(self.encoders, function(i){
                if(self.encoders[i].name === encoder.name){
                  self.encoders.splice(i, 1);
                  return false;
                }
              });
              let updated_encoder = {
                name: encoder.name,
                  data: data.data,
                  url: encoder.url
              };
              self.encoders.push(updated_encoder);
                self.encoders = $filter('orderBy')(self.encoders, 'name');
        },
            function(error){
              console.log(error);
        });
      };

      self.update_status = function(encoder, proc, input){
        let send_data = {};
        if(proc === "stop"){
            send_data = {stop: input};
        }
        if(proc === "start"){
            send_data = {start: input};
        }
        self.update(encoder, send_data);
      };

      self.updateAudio = function(encoder, vol){
        let send_data = {
          'messageType': "audioUpdate",
            'volume': vol
        };

        self.update(encoder, send_data);
      };
    });
})();
