var StorageService = require('../').StorageService;
var path = require('path');
var providers = null;
try {
  providers = require('./providers-private.json');
} catch(err) {
  providers = require('./providers.json');
}

function listContainersAndFiles(ss) {
  ss.getContainers(function (err, containers) {
    if (err) {
      console.error(err);
      return;
    }
    console.log('----------- %s (%d) ---------------', ss.provider, containers.length);
    containers.forEach(function (c) {
      console.log('[%s] %s/', ss.provider, c.name);
      c.getFiles(function (err, files) {
      	if (files) {
      	  files.forEach(function (f) {
          	console.log('[%s] ... %s', ss.provider, f.name);
          });
      	}
      });
    });
  });
}


var scs = new StorageService({ // amazon s3 equivalent, with different endpoints
  provider: 'swisscom',
  key: providers.swisscom.key,
  keyId: providers.swisscom.keyId
});

listContainersAndFiles(scs);


var fs = require('fs');
var path = require('path');
var stream = scs.uploadStream('con1', 'test.jpg');
fs.createReadStream(path.join(__dirname, 'test.jpg')).pipe(stream);

var local = StorageService({
  provider: 'filesystem',
  root: path.join(__dirname, 'storage')
});

listContainersAndFiles(local);

