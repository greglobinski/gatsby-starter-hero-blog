const fs = require('fs')
const date = new Date; 
const year = date.getFullYear();
const month = date.getMonth() + 1; 
const day = date.getDate();
const name =process.argv[2]

const newPost = `${year}-${month}-${day}--${name}`

fs.mkdirSync(`content/posts/${newPost}`)

let stream = fs.createWriteStream(`content/posts/${newPost}/index.md`);

stream.once('open', function(fd) {
  stream.write("---\n");
  stream.write("title:''\n");
  stream.write("cover:''\n");
  stream.write("author:''\n");
  stream.write("---\n");
  stream.end();
});
