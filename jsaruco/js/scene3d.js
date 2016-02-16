'use strict';

import THREE from 'three';
//import ColladaLoader from '../lib/ColladaLoader';

class Scene{

  constructor(settings){
    this.init(settings);
  }

  init(settings) {
    this.scene = new THREE.Scene();

    if(typeof settings !== 'undefined' && typeof settings.canvas !== 'undefined'){
      this.renderer = new THREE.WebGLRenderer({alpha: true, canvas: settings.canvas});
    }else{
      this.renderer = new THREE.WebGLRenderer({alpha: true});
    }
    this.renderer.setClearColor(0xffffff, 0);
    this.renderer.setSize(settings.width, settings.height);

    this.camera = new THREE.PerspectiveCamera(40, settings.width / settings.height, 1, 1000);
    this.scene.add(this.camera);

    var dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(1.5, -1, 3.8);
    dirLight.position.multiplyScalar(50);
    this.scene.add(dirLight);

    this.model = null;
    this.canvas = this.renderer.domElement;

    if(typeof settings !== 'undefined' && typeof settings.element !== 'undefined'){
      settings.element.appendChild(this.canvas);
    }
  }

  render(){
    this.renderer.render(this.scene, this.camera);
    // requestAnimationFrame(() => {
    //   this.render();
    // });
  }

  resize(width, height){
    //console.log(width,height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.render();
  }

  addModel(model){
    if(this.model !== null){
      this.scene.remove(this.model);
    }
    this.model = model;
    this.scene.add(this.model);
  }

  loadModel(url, settings){
    let loader = new THREE.ObjectLoader();
    loader.load(url, (model) => {
      if(typeof settings !== 'undefined'){
        var c = new THREE.Object3D();
        var m = model;
        if(settings.scale){
          var s = settings.scale;
          m.scale.set(s, s, s);
        }
        if(settings.rotation){
          var r = settings.rotation;
          m.rotation.set(THREE.Math.degToRad(r.x), THREE.Math.degToRad(r.y), THREE.Math.degToRad(r.z));
        }
        c.add(m);
        model = c;
      }
      this.model = model;
      this.addModel(this.model);
      this.render();
    });
  }

  update(data){
    if(this.model !== null){
      let object3d = data.object3d;
      this.model.position.copy(object3d.position);
      this.model.rotation.copy(object3d.rotation);
      this.model.scale.copy(object3d.scale);
      this.render();
    }
  }
}

export default Scene;
