require('babel-polyfill');

import Scene from './scene3d';
import AR from './ar';
import {ajax} from './util';


window.onload = function(){

  let url = window.location.hash.substring(1);

  ajax({url: url, responseType: 'json'}).then(

    function resolve(config){

      let ar = new AR({
        video: document.getElementById('feed'),
        canvas: document.getElementById('ar'),
        debug: true,
        modelSize: config.markerSize || 39
      });

      let scene = new Scene({
        element: document.getElementById('threejs')
      });

      document.addEventListener('ar', function(){
        scene.update(ar.getData());
      });

      window.addEventListener('resize', function(){
        ar.resize(window.innerWidth, window.innerHeight);
        scene.resize(ar.width, ar.height);
      });


      if(config.feed === 'camera'){
        ar.setCameraFeed().then(function(){
          scene.resize(ar.width, ar.height);
          scene.loadModel(config.model, config.settings);
        });
      }else{
        ar.setVideoFeed(config.feed).then(function(){
          scene.resize(ar.width, ar.height);
          scene.loadModel(config.model, config.settings);
        });
      }
    },

    function reject(e){
      console.error('error', e);
      document.getElementById('container').innerText = e;
    }
  );
};
