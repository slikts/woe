(function() {
  'use strict';

  function reload(url) {
    url = url || '/';

    var req = new XMLHttpRequest();

    req.onload = window.location.reload.bind(window.location);
    req.onerror = setTimeout.bind(null, reload, 10);

    req.open('head', url, true);
    req.send();
  }

  var sio = io.connect(null, {
    query: 'player=test&foo=bar'
  });

  // sio.on('news', function(data) {
  //   console.log(data);
  //   socket.emit('move', {
  //     my: 'data'
  //   });
  // });

  sio.on('disconnect', reload);
})();