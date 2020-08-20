const express = require('express');
const { say } = require('../pkg/ssvm_nodejs_todo_app_lib.js');

const app = express();
const host = '0.0.0.0';
const port = 3000;
app.use(express.static(__dirname + '/public'));
app.use(fileUpload());
// app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.redirect('/index.html'));

app.post('/infer', function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  console.log(
    'Received ' +
      req.files.image_file.name +
      ' with size: ' +
      req.files.image_file.size
  );

  let image_file = req.files.image_file;
  console.time(image_file.name);
  var result = JSON.parse(infer(data_model, image_file.data, 224, 224));
  console.timeEnd(image_file.name);

  var confidence = 'low';
  if (result[0] > 0.75) {
    confidence = 'very high';
  } else if (result[0] > 0.5) {
    confidence = 'high';
  } else if (result[0] > 0.2) {
    confidence = 'medium';
  }
  res.send(
    'Detected <b>' +
      labels[result[1] - 1] +
      '</b> with <u>' +
      confidence +
      '</u> confidence.'
  );
});

app.listen(port, host, () =>
  console.log(`Server running at http://${host}:${port}`)
);
