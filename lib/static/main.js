'use strict';
var canvas = document.getElementById('view');
var context = canvas.getContext('2d');

var point = new obelisk.Point(canvas.width / 2, canvas.height / 2);
var pixelView = new obelisk.PixelView(canvas, point);
var connected;

function next() {
  // setTimeout(draw, 1000);
  requestAnimationFrame(draw);
}

var one = 20;
var dimension = new obelisk.CubeDimension(one, one, one);
var gray = obelisk.ColorPattern.GRAY;
var color = new obelisk.CubeColor().getByHorizontalColor(gray);
var cube = new obelisk.Cube(dimension, color, true);

var blue = obelisk.ColorPattern.BLUE;
var acolor = new obelisk.CubeColor().getByHorizontalColor(blue);
var adimension = new obelisk.CubeDimension(one, one, one * 2);
var acube = new obelisk.Cube(adimension, acolor, true);

var yellow = obelisk.ColorPattern.YELLOW;
var xcolor = new obelisk.CubeColor().getByHorizontalColor(yellow);
var xdimension = new obelisk.CubeDimension(one, one, one * 2);
var xcube = new obelisk.Cube(xdimension, xcolor, true);


function draw() {
  if (!connected) {
    return;
  }

  var _ents = Object.keys(ents).map(function(key) {
    return ents[key];
  });
  _ents = _ents.sort(dynamicSortMultiple('x', 'z', 'y'));
  _ents = _ents.sort(dynamicSortMultiple('y', 'z', 'x'));

  if (!avatar) {
    avatar = ents['avatar_' + userName];
  }
  if (!avatar) {
    next();

    return;
  }

  // console.log(_ents);
  context.clearRect(0, 0, canvas.width, canvas.height);
  var ax = avatar._x;
  var ay = avatar._y;
  var az = avatar._z;
  // one = 100;
  // one = 40;
  _ents.forEach(function(ent) {
    var x = (ent._x - ax) * one;
    var y = (ent._y - ay) * one;
    var z = (ent._z - az) * one;
    // var p3d = new obelisk.Point3D((ent.x - x), (ent.y - y), (ent.z - z));
    // console.log(x, y, z);
    var q;
    if (ent === avatar) {
      q = acube;
    } else if (ent.type === 'avatar') {
      q = xcube;
    } else {
      q = cube;
    }
    // console.log(ent._x, ent._y, ent._z);
    var p3d = new obelisk.Point3D(x, y, z);
    pixelView.renderObject(q, p3d);
  });

  next();
}

var user = document.getElementById('user');
var userName = localStorage.user;

function setUser() {
  userName = localStorage.user = encodeURIComponent(prompt('user name:', localStorage.user || '').trim());
  if (userName) {
    user.textContent = userName;
  }
}

if (userName) {
  user.textContent = userName;
}

while (!localStorage.user) {
  setUser();
}

user.addEventListener('click', function() {
  var oldUser = userName;
  setUser();
  if (userName !== oldUser) {
    location.reload();
  }
});

function reload(url) {
  url = url || '/';

  var req = new XMLHttpRequest();

  req.onload = window.location.reload.bind(window.location);
  req.onerror = setTimeout.bind(null, reload, 100);

  req.open('head', url, true);
  req.send();
}

var sio = io.connect(null, {
  query: 'user=' + userName + '&password=hunter9'
});

var ents = {};

var messages = document.getElementById('messages');

function say(subject, message, time, global) {
  var item = document.createElement('div');
  var msg = document.createElement('span');
  var ts = document.createElement('span');
  var subj = document.createElement('span');

  msg.classList.add('msg');
  ts.classList.add('ts');
  subj.classList.add('subj');

  subj.textContent = subject.split('_')[1];
  ts.textContent = [time.getHours(), time.getMinutes(), time.getSeconds()]
    .map(function(x, i) {
      return i && x < 10 ? '0' + x : x;
    }).join(':');
  msg.textContent = message;

  item.appendChild(ts);
  item.appendChild(subj);
  item.appendChild(msg);

  if (global) {
    item.classList.add('global');
  }

  messages.appendChild(item);

  scroll(0, messages.offsetHeight);
}


sio.on('event', function(event) {
  console.debug('event', event, event.props);

  var type = event.type;
  var props = event.props;
  var subject = event.subject;

  if (type === 'spawn') {
    ents[subject] = props;
  } else if (type === 'despawn') {
    delete ents[subject];
  } else if (type === 'mutate') {
    var ent = ents[subject];

    for (var key in props) {
      ent[key] = props[key];
    }
  } else if (type === 'say') {
    say(event.subject, props.message, new Date(props.time));
  } else if (type === 'global') {
    say(event.subject, props.message, new Date(props.time), true);
  }
});

var textInput = document.getElementById('text');
var textFocus = false;

textInput.addEventListener('focus', function() {
  textFocus = true;

  if (moving) {
    stop();
  }
});

function stop() {
  sio.emit('event', {
    type: 'stop',
    props: ['move']
  });
  moving = false;
}

textInput.addEventListener('blur', function() {
  textFocus = false;
});

var arrows = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};

var moving;

document.addEventListener('keydown', function(event) {
  if (textFocus) {
    if (event.keyCode === 13) {
      sio.emit('event', {
        type: 'say',
        props: [textInput.value]
      });
      textInput.value = '';
    }

    return;
  }

  var arrow = arrows[event.keyCode];

  if (moving === arrow) {
    return;
  }

  moving = arrow;

  if (arrow) {
    sio.emit('event', {
      type: 'move',
      props: [arrow]
    });
  }
});

// setInterval(function() {
//   sio.emit('event', {
//     type: 'say',
//     props: ['hmm ' + Math.random()]
//   });
// }, 100);

document.addEventListener('keyup', function(event) {
  var key = arrows[event.keyCode];

  if (key) {
    stop();
  }
});

var avatar;

sio.on('connect', function() {
  connected = true;

  draw();
});

sio.on('disconnect', reload);

function dynamicSort(property) {
  return function(obj1, obj2) {
    return obj1[property] > obj2[property] ? 1 : obj1[property] < obj2[property] ? -1 : 0;
  };
}

function dynamicSortMultiple() {
  /*
   * save the arguments object as it will be overwritten
   * note that arguments object is an array-like object
   * consisting of the names of the properties to sort by
   */
  var props = arguments;
  return function(obj1, obj2) {
    var i = 0,
      result = 0,
      numberOfProperties = props.length;
    /* try getting a different result from 0 (equal)
     * as long as we have extra properties to compare
     */
    while (result === 0 && i < numberOfProperties) {
      result = dynamicSort(props[i])(obj1, obj2);
      i++;
    }
    return result;
  };
}