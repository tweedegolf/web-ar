require('babel-polyfill');

import Scene from './scene3d';
import getARInstance from './ar';
import {ajax} from './util';


window.onload = function(){

  let url = window.location.hash.substring(1);

  // load the settings file
  ajax({url: url, responseType: 'json'}).then(

    function resolve(config){

      let scene = new Scene({
        element: document.getElementById('threejs')
      });

      let ar = getARInstance({
        video: document.getElementById('feed'),
        camera: scene.camera,
        debug: false
      });

      document.addEventListener('ar', function(){
        scene.update(ar.getData());
      });

      window.addEventListener('resize', function(){
        ar.resize(window.innerWidth, window.innerHeight);
        scene.resize(ar.width, ar.height);
      });

      if(config.feed === 'camera'){
        ar.setCameraFeed().then(
          // resolve
          function(){
            scene.resize(ar.width, ar.height);
            scene.loadModel(config.model, config.settings);
          },
          // reject
          function(e){
            console.error(e);
          }
        );
      }else{
        ar.setVideoFeed(config.feed).then(
          // resolve
          function(){
            scene.resize(ar.width, ar.height);
            scene.loadModel(config.model, config.settings);
          },
          // reject
          function(e){
            console.error(e);
          }
        );
      }
    },

    function reject(e){
      console.error('error', e);
      document.getElementById('container').innerText = e;
    }
  );
};
