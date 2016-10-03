## 0.3.0
### Added
* Now tasks can define their dependencies    

```js

    export default function factory() {
        const task3 = function task3(done) {
            done();
        };

        task3.dependencies = ['task-1', 'task-2'];

        return task3;
    }

```

### Fixed
* Group task failed if first given argument is not a function

## 0.2.4
### Changed
* Using gulp-util for logging.

## 0.2.3

### Fixed
* Parsing task path on Windows

## 0.2.1

### Fixed
* Group by root folder (task with empty name was registered)

### Changed
* Output colors

## 0.2.0

### Added

* Automatically generated group task
* Colorized console output

## 0.1.1

### Fixed

* Fixed dependency

## 0.1.0

### Added

* Basic tasks registration
* Passing arguments
* Logging
* Throwing errors
