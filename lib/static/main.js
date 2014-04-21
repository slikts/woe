'use strict';
var canvas = document.getElementById('view');
var context = canvas.getContext('2d');

var m_canvas = document.createElement('canvas');
m_canvas.width = canvas.width;
m_canvas.height = canvas.height;
var m_context = m_canvas.getContext('2d');

var point = new obelisk.Point(canvas.width / 2, canvas.height / 2);
var pixelView = new obelisk.PixelView(m_canvas, point);
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


var last;
var fps = document.getElementById('fps');
var lastfps;
var coordsd = document.getElementById('coords');
var posx, posy;
var weightRatio = 0.1;

function draw(dt) {
  if (!last) {
    last = dt;
  } else {
    var adt = dt * (1.0 - weightRatio) + last * weightRatio;
    var _fps = Math.round(1000 / (adt - last));
    if (lastfps != _fps) {
      lastfps = fps.textContent = _fps;
    }
    last = adt;
  }
  if (avatar) {
    var _posx = avatar._x.toFixed(2);
    var _posy = avatar._y.toFixed(2);
    if (_posx !== posx || _posy !== posy) {
      posx = _posx;
      posy = _posy;
      coordsd.textContent = posx + ', ' + posy;
    }
  }

  // console.log(dt)
  if (!connected) {
    return;
  }
  // console.log(dt);

  var _ents = Object.keys(ents).map(function(key) {
    return ents[key];
  });
  _ents = _ents.sort(dynamicSortMultiple('x', 'z', 'y'));
  // _ents = _ents.sort(dynamicSortMultiple('y', 'z', 'x'));

  if (!avatar) {
    avatar = ents['avatar_' + userName];
  }
  if (!avatar || !changes) {
    next();

    return;
  }
  changes = false;

  // console.log(_ents);
  m_context.clearRect(0, 0, canvas.width, canvas.height);
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
  context.drawImage(m_canvas, 0, 0);

  next();
}

document.addEventListener('contextmenu', function(event) {
  event.preventDefault();
});

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

if (!localStorage.said) {
  localStorage.said = JSON.stringify([]);
}
var _said = JSON.parse(localStorage.said);
var said = [];

function say(subject, message, time, global) {
  var ss = subject.split('_')[1] || subject;
  if (ss) {
    said.push([subject, message, time, +global]);
    localStorage.said = JSON.stringify(said);
  }
  var item = document.createElement('div');
  var msg = document.createElement('span');
  var ts = document.createElement('span');
  var subj = document.createElement('span');

  msg.classList.add('msg');
  ts.classList.add('ts');
  subj.classList.add('subj');

  subj.textContent = ss;
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

var changes;
sio.on('event', function(event) {
  console.debug('event', event, event.props);

  var type = event.type;
  var props = event.props;
  var subject = event.subject;

  if (type === 'spawn') {
    changes = true;
    ents[subject] = props;
  } else if (type === 'despawn') {
    changes = true;
    delete ents[subject];
  } else if (type === 'mutate') {
    var ent = ents[subject];
    changes = true;

    for (var key in props) {
      ent[key] = props[key];
    }
  } else if (type === 'say') {
    say(event.subject, props.message, new Date(props.time));
  } else if (type === 'global') {
    say(event.subject, props.message, new Date(props.time), true);
  }
});

_said.forEach(function(x) {
  x[2] = new Date(x[2]);
  say.apply(null, x);
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

var pKeys = {
  left: false,
  up: false,
  right: false,
  down: false
};

var moving;

document.addEventListener('keydown', function(event) {
  if (textFocus) {
    if (event.keyCode === 13 && textInput.value.trim()) {
      sio.emit('event', {
        type: 'say',
        props: [textInput.value.trim()]
      });
      textInput.value = '';
    }

    return;
  }
  if (event.keyCode === 46) {
    sio.emit('event', {
      type: 'uncreate'
    });

    return;
  }

  var arrow = arrows[event.keyCode];

  if (pKeys[arrow] === true || !arrow) {
    return;
  }
  event.preventDefault();

  pKeys[arrow] = true;

  updMove();
});

var angles = {
  up: 90,
  right: 0,
  down: -90,
  left: 180
};

(function() {
  var _xang = {
    '45': ['up', 'right'],
    '135': ['up', 'left'],
    '-45': ['down', 'right'],
    '-135': ['down', 'left']
  };

  Object.keys(_xang).forEach(function(x) {
    angles[_xang[x].sort().join('')] = +x;
  });
})();

var mang = null;
var mm = false;

function xmm(event) {
  var ang = Math.round(Math.atan2(event.clientX - canvas.width / 2, event.clientY - canvas.height / 2) * 180 / Math.PI / 15) * 15;
  if (mang === ang) {
    return;
  }
  mang = ang;
  mm = true;
  moving = true;

  // console.log('mm', mang);
  sio.emit('event', {
    type: 'move',
    props: [ang + 45]
  });
}

canvas.addEventListener('mousedown', function(event) {
  if (event.button === 0) {
    event.preventDefault();
    event.stopPropagation();
    sio.emit('event', {
      type: 'create',
      props: ['BLACK']
    });
  } else if (event.button === 2) {
    xmm(event);
  }
}, false);

canvas.addEventListener('mousemove', function(event) {
  if (!mm) {
    return;
  }
  xmm(event);
}, true);

document.addEventListener('mouseup', function(event) {
  if (event.button === 2 && moving) {
    // console.log('mstop')
    stop();
    moving = false;
    mm = false;
    mang = null;
  }
}, false);

function updMove() {
  if (mm) {
    return;
  }
  var mKeys = Object.keys(pKeys).map(function(x) {
    return pKeys[x];
  }).filter(function(x) {
    return x;
  });

  // moving = mKeys.length;

  if (!mKeys.length || mKeys.length > 2) {
    stop();
    moving = false;

    return;
  }

  var ang = null;
  if (mKeys.length === 1) {
    Object.keys(pKeys).every(function(x) {
      if (pKeys[x]) {
        ang = angles[x];
      }

      return ang === null;
    });
  }
  if (mKeys.length === 2) {
    Object.keys(pKeys).every(function(x) {
      Object.keys(pKeys).every(function(y) {
        if (x !== y && pKeys[x] && pKeys[y]) {
          var q = [x, y].sort().join('');
          // console.log(123123, q)
          ang = angles[q];
          return false;
        }
        return true;
      });
      return ang === null;
    });
  }

  if (ang !== null) {
    sio.emit('event', {
      type: 'move',
      props: [ang + 135]
    });
  }
}

document.addEventListener('keyup', function(event) {
  var key = arrows[event.keyCode];

  pKeys[key] = false;

  updMove();
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