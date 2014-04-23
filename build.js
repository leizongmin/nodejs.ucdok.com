/**
 * 生成页面
 */

var fs = require('fs');
var path = require('path');
var ejs = require('ejs');


process.chdir(__dirname);

// 创建pages目录
try {
  fs.mkdirSync('pages');
} catch (err) {
  console.log(err.toString());
}

// 载入数据
var data = {
  summary: fs.readFileSync('./data/summary.txt', {encoding: 'utf8'}),
  index:   fs.readFileSync('./data/index.txt', {encoding: 'utf8'}),
  authors: fs.readFileSync('./data/author.txt', {encoding: 'utf8'})
};
data.index = data.index.split(/\r?\n\r?\n\r?\n/);
data.index = data.index.map(function (str) {
  var lines = str.trim().split(/\r?\n/);
  return {
    title:   lines[0],
    author:  (function (text) {
                var b = text.split(/\s+/g);
                return {
                  name:     b[0],
                  username: b[1]
                };
              })(lines[1]),
    content: lines.slice(2).join('\n')
  };
});
data.index.forEach(function (item, i) {
  item.filename = 'pages/' + (i + 1) + '.html';
});
data.authors = data.authors.split(/\r?\n\r?\n\r?\n/);
data.authors = data.authors.map(function (str) {
  var lines = str.trim().split(/\r?\n/);
  return {
    name:     lines[0],
    username: lines[1],
    url:      lines[2],
    about:    lines.slice(3).join('\n')
  };
});

// 载入模板
var render = ejs.compile(fs.readFileSync('./data/template.html', {encoding: 'utf8'}));

// 生成页面
function renderPage (filename, data) {
  console.log('make page: %s', filename);
  fs.writeFileSync(filename, render(data));
}
renderPage('index.html', {
  isHome: true,
  data:   data,
  index:  data.index
});
data.index.forEach(function (item) {
  renderPage(item.filename, {
    isSection: true,
    data:      item,
    index:     data.index
  });
});
renderPage('author.html', {
  isAuthor: true,
  data:     data,
  index:  data.index,
  authors:  data.authors
});


console.log('OK');
