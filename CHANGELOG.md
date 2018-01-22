# CHANGELOG

## 1.0.1 - 2018-01-22

* Handle null editor root path when checking for .formatter.exs
* Add link to mix format task documentation in README

## 1.0.0 - 2018-01-17

* Release 1.0 to coincide with release of formatter in Elixir 1.6.0
* Remove instructions for downloading and compiling Elixir from README

## 0.4.6 - 2018-01-02

* Cleanup spec tests in preparation for 1.0 release

## 0.4.5 - 2017-12-10

* Correctly assign cwd when project contains multiple project folders
* Add additional spec tests

## 0.4.4 - 2017-12-03

* Change menu command to "Format" since action is contextual based on selection

## 0.4.3 - 2017-12-01

* Use setTextViaDiff to maintain bookmarks and other metadata (@balduncle)

## 0.4.2 - 2017-11-29

* Dismiss outstanding notification on format success

## 0.4.1 - 2017-11-29

* Add new formatOnSave setting to README

## 0.4.0 - 2017-11-22

* Support conditional formatOnSave based on .formatter.exs presence (@hopsor)
* Only set shell option on Windows
* Move setting logic into separate module

## 0.3.0 - 2017-11-17

* Remove mixExecutable and use elixirExecutable to determine mix path

## 0.2.6 - 2017-11-08

* Use double-quotes on paths with spaces for Windows compatibility

## 0.2.4 - 2017-11-07

* Quote executable paths when they contain spaces

## 0.2.3 - 2017-11-07

* Fix "spawnSync elixir ENOENT" error on Windows (@indyone)
* Display Node.js error messages in notifications (@indyone)

## 0.2.2 - 2017-11-01

* Format entire file when selected buffer range is empty
* Remove tmp package dependency

## 0.2.1 - 2017-10-23

* Fix header image in README

## 0.2.0 - 2017-10-23

* Use STDIN/STDOUT to communicate with formatter
* Add Usage and Description sections to README
* Add .eslintrc file to enforce JavaScript style

## 0.1.6 - 2017-10-12

* Format entire file on save even if text selection exists

## 0.1.5 - 2017-10-11

* Add better installation instructions to README

## 0.1.4 - 2017-10-11

* Add elixirExecutable setting

## 0.1.3 - 2017-10-11

* Set cwd to editor's project path so ".formatter.exs" are used (@rickclare)
* Add spec tests

## 0.1.2 - 2017-10-10

* Add continuous integration support via Travis CI

## 0.1.1 - 2017-10-09

* Ensure temporary files are deleted

## 0.1.0 - 2017-10-09

* First release! 🎉
