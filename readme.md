# Post-a-Tile

A reasonably simple example of using [NodeTiles](https://github.com/nodetiles/nodetiles-core) to render POSTed GeoJSON data. Try it out at [http://post-a-tile.herokuapp.com/](http://post-a-tile.herokuapp.com/).

This isn't even sort of the most efficient approach, but it *is* nice and simple. You can send JSON data and the request body or as the `data` parameter in a form-encoded POST. Simply POST to `/tiles/:zoom/:x/:y.png` and you'll get back a rendered png. Right now it only draws dots for points, but changing that is as easy as modifying the `style.mss` file (it's in CartoCSS).

## Run it yourself

You'll need a recent version of Node.js and you'll also have to install Cairo. The easiest way to do both of these things is with [Homebrew](http://brew.sh/). Once you've got Hombrew, do the following on your console:

```
$ brew install nodejs
$ brew install cairo
```

Cairo might take a bit.

Once all that's good to go, clone this repository and install dependencies:

```
$ git clone git@github.com:Mr0grog/post-a-tile.git
$ cd post-a-tile
$ npm install
```

And then you can run it:

```
$ node server.js
```

Now just point your browser to [http://localhost:3000](http://localhost:3000) and do some tiling.

## Or run it on Heroku

You'll need the [Cairo buildpack](https://github.com/mojodna/heroku-buildpack-cairo) installed. There are a few ways to use it, but you'll probably just want to do the following after you've set up your Heroku app:

```
$ heroku config:set BUILDPACK_URL=https://github.com/mojodna/heroku-buildpack-multi.git#build-env

$ cat << EOF > .buildpacks
https://github.com/mojodna/heroku-buildpack-cairo.git
https://github.com/heroku/heroku-buildpack-nodejs.git
EOF

$ git push heroku master
```

Copyright 2014 Rob Brackett. Licensed under the BSD license. See LICENSE for details.
