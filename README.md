### WebAR2

 - `npm install` installs all dependencies
 - `npm run watch` starts a local webserver at port 8000 and watchify
 - `npm run build` builds app and generates source map
 - install [guard livereload](https://github.com/guard/guard-livereload) and run `bundle exec guard` for livereload


### configuration

You can put the url to the configuration file after the hash:

`http://localhost:8000/#data/settings1.json`

A configuration file should look like:

```
{
  "url": "url/to/3D_model",
  "feed": "url/to/video.ogg",
  "scale": 15
}
```

- url: should be a model in json format
- feed: set to "camera" if you want to use the feed of a camera
- scale: set to smaller values when using a camera feed

You'll find 2 examples of working configuration files in the data folder: `settings1.json` and `settings2.json`.

