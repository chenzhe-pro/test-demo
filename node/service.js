var http = require('http');
var url = require('url');
var util = require('util'); 
var querystring = require('querystring');

http.createServer(function (request, response) {

	// 发送 HTTP 头部 
	// HTTP 状态值: 200 : OK
	// 内容类型: text/plain
	// response.writeHead(200, {'content-Type': 'text/html; charset=UTF-8','connection': 'keep-alive'});

	// 发送响应数据 "Hello World"
	// response.end(readFileSync("data.txt"));
	var info,rep,pathname;
	if (request.url) {
		info=url.parse(request.url, true),
		pathname=info.pathname;
		readPage(pathname.substr(1),response,info);
	};

	

}).listen(8888);

function readFile(file)//非堵塞
{
	var fs = require("fs");
	var data = fs.readFile(file,function(error,data){
		console.log(data.toString());
		return data.toString();
	});
}
function readFileSync(file)
{
	var fs = require("fs"),
	data = fs.readFileSync(file);
	return data.toString();
}
function readPage(file,response,info)//非堵塞
{
	var fs = require("fs"),headOption={'content-type': 'text/html; charset=UTF-8','connection': 'keep-alive'};
	var arr=info.pathname.split("."),fileType=arr[arr.length-1];
	var data = fs.readFile(file,function(error,data){
		if(error)
		{

		}
		else if(data)
		{
			switch(fileType)
			{
				case "html":
				break;
				case "js":
				headOption={'content-type': 'text/script; charset=UTF-8','connection': 'keep-alive'};
				break;
				case "jpg":
				headOption={'content-type': 'image/jpeg;','connection': 'keep-alive'};
				break;
				case "png":
				headOption={'content-type': 'image/png;','connection': 'keep-alive'};
				break;
				case "gif":
				headOption={'content-type': 'image/gif;','connection': 'keep-alive'};
				break;
			}
			// headOption.content-Type="text/"
			
			response.writeHead(200, headOption);
			// console.log(data.toString());
			response.write(data.toString());
			response.end();
		}
		
	});
}
function events()
{
	// 引入 events 模块
	var events = require('events');
	// 创建 eventEmitter 对象
	var eventEmitter = new events.EventEmitter();
	// eventEmitter.
}
	// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');