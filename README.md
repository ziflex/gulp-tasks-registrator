# gulp-tasks-registrator

> Clean up your Gulpfile by splitting it into small isolated tasks

Gulp tasks registrator.

[![npm version](https://badge.fury.io/js/gulp-tasks-registrator.svg)](https://www.npmjs.com/package/gulp-tasks-registrator)
[![Build Status](https://secure.travis-ci.org/ziflex/gulp-tasks-registrator.svg?branch=master)](http://travis-ci.org/ziflex/gulp-tasks-registrator)  

Registrator runs through a given directory and registers found ```.js``` files as gulp tasks.  

## Install

```sh

    $ npm install --save-dev gulp-tasks-registrator

```

## Basic Usage

For example, we have this folder structure with our tasks:

````sh

    tasks
        env.js
        build
            scripts
                app.js
                vendors.js
            styles.js

````

Registrator will create tasks using convention - {folder1}:{folderN}:{filename}, ignoring root folder:  

* env  
* build:styles  
* build:scripts:app  
* build:scripts:vendors

#### ./gulpfile.js

```javascript

    var path = require('path');
    var $ = require('gulp-load-plugins')(
        pattern: [
            'gulp',
            'gulp-*',
            'gulp.*'
        ]
    );

    require('gulp-tasks-registrator')({
        gulp: $.gulp,
        dir: path.join(__dirname, '/tasks'),
        args: [$]
    });

```

#### ./tasks/env.js
Each file should contain factory function which returns an actual task function.  
Factory will receive any arguments that were passed into registrator.

```javascript

    module.exports = function factory($) {
        return task() {
            return $.gulp.src(...)
        };
    };

````

## Grouping tasks
We can group small tasks with, so called, high order tasks, just by setting ```group``` parameter to ```true```.

```javascript

    require('gulp-tasks-registrator')({
        gulp: gulp,
        dir: path.join(__dirname, '/tasks'),
        args: [gulp],
        group: true
    });

```

For example, we have this folder structure with our tasks:

````sh

    tasks
        env.js
        build
            scripts.js
            styles.js
            assets.js

````

Except regular tasks, we will register high order task called ```build```, which will have all nested tasks as dependencies (nested high order tasks included).

It will be the same if we created it manually, like this:

````javascript

    gulp.task('build', ['build:scripts', 'build:styles', 'build:assets'], function(done) {
        done();
    });

````

## Tasks dependencies
Also, since version 0.3.0, it is possible to define dependencies for each tasks:

````javascript

    module.exports = function factory($) {
        const task = task() {
            return $.gulp.src(...)
        };

        task.dependencies = ['task1', 'task2'];

        return task;
    };

````

### API

#### registrator(options)

#### options.gulp
Type: `object`.  
Gulp instance.  

#### options.dir
Type: `string`.  
Full path to task factories directory.   

### options.group
Type: `boolean`.    
Creates gulp task based on folder name and adds nested tasks as dependencies.      
Optional.    

#### options.args
Type: `Array<any>`.  
Arguments to pass to task factories.  
Optional.  

#### options.filter
Type: `String|Function`.  
RegExp string or a function for tasks filtering.  
Task full path is passed as a function argument.   
Optional.  

#### options.verbose
Type: `boolean`.  
Defines whether to push to console logs.  
Optional.  
Default false.  

#### options.panic
Type: `boolean`.  
Defines whether to throw error if task registration failed.  
Optional.  
Default true.

### License

The MIT License (MIT)    
Copyright (C) 2015 Tim Voronov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
