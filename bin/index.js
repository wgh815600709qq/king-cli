#! /usr/bin/env node

const pragram = require('commander');
const { getPackageVersion, copyDir } = require('../utils/fsClass');
const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const rootPath = path.resolve(__dirname, '../');

pragram
    .version(getPackageVersion(), '-v, -version')
    .command('create <dir>')
    .description('create a project pure or by template')
    .option('-p', 'create a pure project')
    .option('-t', 'create a project by template')
    .action(function (dir, cmd) {
      if (cmd.p) {
        console.log('create on pure')
        fs.mkdir(dir)
      } else if (cmd.t) {
        console.log('create by template')
        inquirer.prompt({
            type: 'list',
            name: 'tpl',
            message: '选择项目模板',
            choices: [
                {name: 'react脚手架', value: 'react'},
                {name: 'express脚手架', value: 'express'},
                {name: 'koa脚手架', value: 'koa'}
            ],
            default: 0
        }).then(function(data) {
            const destPath = path.resolve(rootPath, `./${dir}`);
            const srcPath = path.resolve(rootPath, `./template/${data.tpl}`)
            copyDir(srcPath, destPath);
        })
      }
    });
pragram
    .command('tool')
    .description('support useful tools for debugger')
    .action(function(){
        inquirer.prompt({
            type: 'list',
            name: 'lib',
            message: '选择调试类库',
            choices: [
                {name: 'lodash.js', value: 'lodash'},
                {name: 'immutable.js', value: 'immutable'},
                {name: '模仿Chrome-console', value: 'console'}
            ],
            default: 0
        }).then(function(data) {
            console.log('当前使用的类库:' + data.lib)
            switch(data.lib) {
                case 'lodash':
                    inquirer.prompt({
                        type: 'input',
                        name: 'expression',
                        message: '输入lodash执行语句,用$表示类库本身，如$.size([1,2,3])'
                    }).then(function(data) {
                        global.$ = require('lodash');
                        let result;
                        try {
                           result = eval(data.expression);
                        } catch(e) {
                            if (e) console.warn('表达式解析有误')
                        }
                        console.log(result)
                    })
                    break
                case 'immutable':
                    inquirer.prompt({
                        type: 'input',
                        name: 'expression',
                        message: '输入immutable执行语句,用$表示类库本身，如$.is($.List([1,2,3]), $.List([1,2,3]))'
                    }).then(function(data) {
                        global.$ = require('immutable');
                        let result;
                        try {
                           result = eval(data.expression);
                        } catch(e) {
                            if (e) console.warn('表达式解析有误')
                        }
                        console.log(result)
                    })
                    break
                case 'console':
                    inquirer.prompt({
                        type: 'input',
                        name: 'expression',
                        message: '输入js执行语句，如123 * 456'
                    }).then(function(data) {
                        let result;
                        try {
                           result = eval(data.expression);
                        } catch(e) {
                            if (e) console.warn('表达式解析有误')
                        }
                        console.log(result)
                    })
                    break
                default:
                    console.log(`cli hasnot setted lib ${data.lib}`);
                    break
            }
        })
    })
pragram.parse(process.argv)
