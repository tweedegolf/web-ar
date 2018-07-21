### WebAR2

 - `npm install` installs all dependencies
 - `npm start` starts a local webserver at port 8000
 - `npm run watch-jsaruco` starts watching the jsaruco version
 - `npm run watch-jsartoolkit` starts watching the jsartoolkit version
 - `npm run build-jsaruco` builds the jsaruco app and generates source map
 - `npm run build-jsartoolkit` builds the jsartoolkit app and generates source map
 - install [guard livereload](https://github.com/guard/guard-livereload) and run `bundle exec guard` for livereload


### configuration

You can put the url to the configuration file after the hash:

`http://localhost:8000/jsartoolkit/#data/settings1.json`

A configuration file should look like:

```
{
  "url": "url/to/3D_model",
  "feed": "url/to/video.ogg",
  "scale": 15,
  "rotation": {
    "x": 0,
    "y": 0,
    "z": 0
  }
}
```

- url: should be a model in json format
- feed: set to "camera" if you want to use the feed of a camera
- scale: set to smaller values when using a camera feed

You'll find 2 examples of working configuration files in the data folder: `settings1.json` and `settings2.json`.

Note that settings1.json does not work in the jsaruco version because the marker used in the video is not a valid jsaruco marker.

More information see this [blogpost](https://tweedegolf.nl/blog/11/augmented-reality-with-web-technologies)
