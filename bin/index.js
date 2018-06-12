#!/usr/bin/env node

const Promise = require('bluebird')
const program = require('commander')
const path    = require('path')
const fs      = require('fs')

const TEMPLATE_DIR = path.join(__dirname, '..', 'templates')
const VERSION      = require('../package').version
const _0755        = parseInt('0755', 8)



program
  .name('tgen')
  .version(VERSION, '    --version')
  .usage('<dir>')
  .parse(process.argv)

function log(data) {
  console.log(data)
}

const createPath = (fromDir) => (toDir) => (file) => ({
  from: path.join(fromDir, file),
  to: path.resolve(toDir, file)
})

function copy({ from, to }) {
  return fs
    .createReadStream(from)
    .pipe(fs.createWriteStream(to))
} 

const mkdir = Promise.promisify(fs.mkdir);

function main() {
  const destPath = program.args.shift() || '.'
  const createPathFromTemplateTo = createPath(TEMPLATE_DIR)
  
  const files = [
    'package.json',
    'webpack.config.js',
    'common-import.js',
    'about/about.css',
    'about/about.js',
    'home/home.css',
    'home/home.js',
  ]
  
  Promise.all([
    mkdir(path.join(destPath, 'about'), _0755),
    mkdir(path.join(destPath, 'home'), _0755)
  ])
  .then(_ => 
    // Copy files to destination path
    files
      .map(createPathFromTemplateTo(destPath))
      .forEach(copy)
  )
  .then(_ => log('Generate successfully!'))
} 

main()

