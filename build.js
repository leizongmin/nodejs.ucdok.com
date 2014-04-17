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
  index: fs.readFileSync('./data/index.txt', {encoding: 'utf8'})
};
data.index = data.index.split(/\r?\n\r?\n\r?\n/);
data.index = data.index.map(function (str) {
  var lines = str.trim().split(/\r?\n/);
  return {
    title:   lines[0],
    author:  parseAuthor(lines[1]),
    content: lines.slice(2).join('\n')
  };
});
data.index.forEach(function (item, i) {
  item.filename = 'pages/' + (i + 1) + '.html';
});
function parseAuthor (text) {
  var b = text.split(/\s+/g);
  return {
    name:     b[0],
    username: b[1]
  };
}

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
    isHome: false,
    data:   item,
    index:  data.index
  });
});

console.log('OK');
