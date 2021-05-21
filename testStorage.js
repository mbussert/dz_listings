/**
 * 
 * @param {*} params
 */
async function upload(params) {
  const {Storage} = require('@google-cloud/storage');
  const storage = new Storage({keyFilename: ''});
  // Replace with your bucket name and filename.
  const bucketname = 'dz-listings-donations';
  const filename = 'package.json';

  const res = await storage.bucket(bucketname).upload('./' + filename);
  // `mediaLink` is the URL for the raw contents of the file.
  const url = res[0].metadata.mediaLink;

  // Need to make the file public before you can access it.
  await storage.bucket(bucketname).file(filename).makePublic();

  // Make a request to the uploaded URL.
  const axios = require('axios');
  const pkg = await axios.get(url).then((res) => res.data);
  console.log({url: url, name: pkg.name});
}

upload({});
