'use strict';

while (!localStorage.user) {
  localStorage.user = encodeURIComponent(prompt('user name:').trim());
}

var userName = localStorage.user;
var user = document.getElementById('user');
user.textContent = userName;

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

function say(subject, message, time) {
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
  }
});

var textInput = document.getElementById('text');
var textFocus = false;

textInput.addEventListener('focus', function() {
  textFocus = true;

  stop();
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

var canvas = document.getElementById('view');

sio.on('disconnect', reload);

var point = new obelisk.Point(300, 300);

// create view instance to nest everything
// canvas could be either DOM or jQuery element
var pixelView = new obelisk.PixelView(canvas, point);

// create cube dimension and color instance
var dimension = new obelisk.CubeDimension(20, 20, 20);
var gray = obelisk.ColorPattern.GRAY;
var color = new obelisk.CubeColor().getByHorizontalColor(gray);

// build cube with dimension and color instance
var cube = new obelisk.Cube(dimension, color, true);

var q = 1000;
var p3d = new obelisk.Point3D(q, q, q);

// render cube primitive into view
// pixelView.renderObject(cube);

for (var i = 0; i < 3; i++) {
  // cube = new obelisk.Cube(dimension, color, true);
  q = 100 * (i + 1);
  p3d = new obelisk.Point3D(q, q, 0);
  pixelView.renderObject(cube, p3d);
}