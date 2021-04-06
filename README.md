脚手架工具其实就是node-cli的应用，创建脚手架工具就是创建一个node-cli应用。

1、创建项目文件夹，作为项目根目录【gongye-test】

2、进入项目根目录，npm init -y 初始化项目

3、打开 package.json 文件，增加`"bin": "cli.js"` ， 作为应用入口文件

4、与 package.json 同级创建 cli.js 文件，而且应用入口文件必须要有文件头 `#!/usr/bin/env node`

5、与 package.json 同级创建 templates 文件夹，文件夹下添加脚手架在工作时需要生成文件的模板文件【 index.html 和 index.css】

6、使用 npm link 将当前 gongye-test link 到全局

7、在桌面创建 demo 文件夹，终端进入到文件夹下，运行 gongye-test，自动生成文件

核心代码如下：

```
// package.json:
{
  "name": "gongye-test",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "bin": "cli.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "ejs": "^3.1.6",
    "inquirer": "^8.0.0"
  }
}

// cli.js
#!/usr/bin/env node
// Node cli 应用入口文件必须要有上面的文件头
// 如果是Linux 或者 macOS 系统下，还需要修改此文件的读写权限为 755
// 具体就是通过 chmod 755 cli.js 实现修改
// 脚手架的工作过程： 
// 1、通过命令行交互询问用户问题；
// 2、根据用户回答的结果生成文件。
const fs = require('fs')
const path = require('path')
// 需要下载 inquirer 模块
const inquirer = require('inquirer')
// 需要下载 ejs 模块
const ejs = require('ejs')
inquirer.prompt([
	{
		type: 'input',
		name: 'name',
		message: 'Product name?'
	}
])
.then(anwsers => {	// 根据用户的回答结果生成文件
	// 模板目录
	const tmpDir = path.join(__dirname, 'templates')
	// 目标目录
	const destDir = process.cwd()
	// 将模板下的文件全部转换到目标目录
	// 使用 fs.readdir 方法读取模板文件夹下的所有文件
	fs.readdir(tmpDir, (err, files) => {
		if (err) throw err
		files.forEach(file => {
			// 通过模板引擎渲染文件
			// renderFile 方法
			// 参数1：文件的绝对路径；
			// 参数2：模板引擎工作时的上下文；
			// 参数3：回调函数，渲染成功之后执行
			ejs.renderFile(path.join(tmpDir, file), anwsers, (err, result) => {
				if (err) throw err
				// fs.writeFileSync 接收两个参数，写入目录，写入内容
				fs.writeFileSync(path.join(destDir, file), result)
			})
		})
	})
})

// index.html:
<!DOCTYPE html>
<html>
<head>
	<title><%= name %></title>
</head>
<body>
	<h1><%= name %></h1>
</body>
</html>

// index.css:
body {
	margin: 0;
	background: #f0f0f0;
}
```

