# Atom Elixir Formatter

[![Build Status](https://travis-ci.org/rgreenjr/atom-elixir-formatter.svg?branch=master)](https://travis-ci.org/rgreenjr/atom-elixir-formatter) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](<>)

![header](https://raw.githubusercontent.com/rgreenjr/atom-elixir-formatter/master/images/heading.png)

![demo](https://raw.githubusercontent.com/rgreenjr/atom-elixir-formatter/master/images/demo.gif)

## Description

An Elixir source code formatter for the Atom editor. It automatically formats
Elixir code using the new formatter in Elixir v1.6.

## Installation

Note that `atom-elixir-formatter` requires Elixir v1.6, which is currently
unreleased. You'll need to download and compile the master branch of Elixir:

```sh
git clone https://github.com/elixir-lang/elixir.git
cd elixir
make clean test
```

Next, install the `atom-elixir-formatter` package:

```sh
apm install atom-elixir-formatter
```

Last, restart Atom and change the `atom-elixir-formatter` setting for **Elixir
Executable** to the absolute path of your `elixir` executable.

![settings](https://raw.githubusercontent.com/rgreenjr/atom-elixir-formatter/master/images/settings.png)

## Usage

Elixir files are formatted automatically on save. This can be disabled in
Settings, or set to occur only when projects include a `.formatter.exs` file.

You can manually format sections of code using the keyboard shortcut
<kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>F</kbd>.

## Maintainers

[Ron Green](https://github.com/rgreenjr)
