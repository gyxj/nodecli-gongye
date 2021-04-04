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