const http = require('http');
fetch('http://localhost:3000/videos/test.mp4').then(r => console.log(r.status));
