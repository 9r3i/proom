# proom
picture room

# usage
```html
  <!-- proom repo -->
  <meta name="proom:repo" content="./gallery.js" />
  <!-- proom property -->
  <script type="text/javascript" src="proom.js"></script
```
initialize onload
```html
<body onload="proom.init()">
```

# sample
## gallery sample
this is sample for gallery in javascript
```js
const PROOM_GALLERY={
  room:'', // lproom server or proxy if you have one
  repo:'https://github.com/9r3i/proom/releases/download/', // host
  ext:'jpg',     // file extention
  interval:3,    // interval in second
  password:'',   // if the server has one
  previous:'<<', // previous button
  next:'>>',     // next button
  gallery:{
    "001":{ // must be 3 padded zero of stage as well as level
      title:"palestine children", // * required; stage title
      level:15, // * required; how many level on this stage
    }
  }
};
```

## html sample
and this is sample for html
```html
<!DOCTYPE html><html lang="en-US" dir="ltr"><head>
  <!-- browser property -->
  <meta http-equiv="content-type" content="text/html;charset=utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
  <!-- web property -->
  <title>9r3i\proom</title>
  <meta name="keywords" content="proom, room, picture" />
  <meta name="description" content="picture room" />
  <meta name="robots" content="no follow,no index" />
  <meta name="author" content="9r3i" />
  <meta name="uri" content="https://github.com/9r3i" />
  <!-- proom repo -->
  <meta name="proom:repo" content="./gallery.js" />
  <!-- proom property -->
  <script type="text/javascript" src="proom.js"></script>
</head><body onload="proom.init()">
</body></html>
```

# closing
thats all there is to it, alhamdulillaah...
