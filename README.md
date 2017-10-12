# Atom Elixir Formatter

[![Build Status](https://travis-ci.org/rgreenjr/atom-elixir-formatter.svg?branch=master)](https://travis-ci.org/rgreenjr/atom-elixir-formatter) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

![header](header.png)

An Atom package to format Elixir source code.

![demo](demo.gif)

## Installation

Note that **atom-elixir-formatter** requires Elixir 1.6, which is currently unreleased. You'll need to download and compile the master branch of Elixir.

```sh
git clone https://github.com/elixir-lang/elixir.git
cd elixir
make clean test
```

Install the **atom-elixir-formatter** package.

```sh
apm install atom-elixir-formatter
```

Then from the **atom-elixir-formatter** settings in Atom, set **Elixir Executable** and **Mix Executable** to the absolute paths of the `elixir` and `mix` executables.

## Maintainers

[Ron Green](https://github.com/rgreenjr)
