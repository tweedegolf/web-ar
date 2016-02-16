//import ARToolKit from '../lib/JSARToolKit.min'; // unfortunately we need to add it in html
import THREE from 'three';

const CAPTURE_WIDTH = 640;

let instance;
let FLARParam = window.FLARParam;
let NyARRgbRaster_Canvas2D = window.NyARRgbRaster_Canvas2D;
let FLARSingleIdMarkerDetector = window.FLARSingleIdMarkerDetector;
let NyARTransMatResult = window.NyARTransMatResult;


class AR{

  constructor(settings){
    //console.log(settings);
    window.DEBUG = settings.debug; // JSARToolKit uses a global DEBUG variable (!)
    this.scale = settings.scale || 120; // scale of the markers in real life in mm (120)
    this.threshold = settings.threshold || 100;  // (100)
    this.camera = settings.camera;
    this.video = settings.video;
    this.video.loop = true;
    this.video.volume = 0;
    this.video.autoplay = true;
    this.video.controls = false;
  }


  setCameraFeed(){
    return new Promise((resolve, reject) => {
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      if(!navigator.getUserMedia){
        reject('no support for getUserMedia, use a video feed');
        return;
      }

      navigator.getUserMedia({video: true},
        //success
        (stream) => {
          this.video.addEventListener('loadedmetadata', (e) => {
            this._setup(e);
            resolve();
          });
          if(window.URL){
            this.video.src = window.URL.createObjectURL(stream);
          }else{
            this.video.src = stream;
          }
        },
        //error
        (msg) => {
          reject('access to webcam not granted', msg);
        }
      );
    });
  }


  setVideoFeed(url){
    return new Promise((resolve, reject) => {
      this.video.addEventListener('loadedmetadata', (e) => {
        this._setup(e);
        resolve();
      });
      this.video.src = url;
    });
  }


  getData(){
    return this.glMatrix;
  }


  _tick(){
    this.captureContext.drawImage(this.video, 0, 0, this.captureCanvas.width, this.captureCanvas.height);
    this.captureCanvas.changed = true;
    let detected = this.detector.detectMarkerLite(this.raster, this.threshold);

    if(detected){
      this.detector.getTransformMatrix(this.resultMatrix);
      copyMarkerMatrix(this.glMatrix, this.resultMatrix);
      document.dispatchEvent(new Event('ar'));
    }

    requestAnimationFrame(() => {
      this._tick();
    });
  }


  resize(width){
    this.width = width;
    this.height = (1 / this.ratio) * width;
    this.video.width = this.width;
    this.video.height = this.height;
  }


  _setup(e){
    this.ratio = e.target.clientWidth / e.target.clientHeight;
    this.width = window.innerWidth;
    this.height = (1 / this.ratio) * CAPTURE_WIDTH;

    this.video.width = this.width;
    this.video.height = this.height;

    this.captureCanvas = document.createElement('canvas');
    this.captureContext = this.captureCanvas.getContext('2d');
    this.captureCanvas.width = CAPTURE_WIDTH;
    this.captureCanvas.height = Math.round((1 / this.ratio) * CAPTURE_WIDTH);

    if(window.DEBUG === true){
      this.captureCanvas.id = 'debugCanvas';
      //this.captureCanvas.style.transform = 'scale(-1.0, 1.0)';
      document.body.appendChild(this.captureCanvas);
    }

    this.raster = new NyARRgbRaster_Canvas2D(this.captureCanvas);
    this.param = new FLARParam(this.captureCanvas.width, this.captureCanvas.height);
    this.detector = new FLARSingleIdMarkerDetector(this.param, this.scale);
    this.detector.setContinueMode(true);

    this.glMatrix = new Float32Array(16);
    this.resultMatrix = new NyARTransMatResult();

    this.param.copyCameraMatrix(this.glMatrix, this.camera.near, this.camera.far);
    this.camera.projectionMatrix.setFromArray(this.glMatrix);

    this._tick();
  }
}


function copyMarkerMatrix(glMat, arMat) {
  glMat[0] = arMat.m00;
  glMat[1] = -arMat.m10;
  glMat[2] = arMat.m20;
  glMat[3] = 0;
  glMat[4] = arMat.m01;
  glMat[5] = -arMat.m11;
  glMat[6] = arMat.m21;
  glMat[7] = 0;
  glMat[8] = -arMat.m02;
  glMat[9] = arMat.m12;
  glMat[10] = -arMat.m22;
  glMat[11] = 0;
  glMat[12] = arMat.m03;
  glMat[13] = -arMat.m13;
  glMat[14] = arMat.m23;
  glMat[15] = 1;
}


(function extendThreejs(){
  THREE.Matrix4.prototype.setFromArray = function(m) {
    return this.set(
        m[0], m[4], m[8], m[12],
        m[1], m[5], m[9], m[13],
        m[2], m[6], m[10], m[14],
        m[3], m[7], m[11], m[15]
      );
  };
}());


function getARInstance(settings){
  if(instance){
    return instance;
  }
  instance = new AR(settings);
  return instance;
}

export default getARInstance;
