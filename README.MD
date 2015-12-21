# gulp-tasks-registrator

Gulp tasks registrator.

[![npm version](https://badge.fury.io/js/gulp-tasks-registrator.svg)](https://www.npmjs.com/package/gulp-tasks-registrator)
[![Build Status](https://secure.travis-ci.org/ziflex/gulp-tasks-registrator.svg?branch=master)](http://travis-ci.org/ziflex/gulp-tasks-registrator)  

Registrator runs through a target directory and tries to register found ```.js``` files as gulp tasks.  


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
