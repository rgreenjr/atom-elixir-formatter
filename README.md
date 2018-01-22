![header](https://raw.githubusercontent.com/rgreenjr/atom-elixir-formatter/master/images/heading.jpg)

![demo](https://raw.githubusercontent.com/rgreenjr/atom-elixir-formatter/master/images/demo.gif)

[![Build Status](https://travis-ci.org/rgreenjr/atom-elixir-formatter.svg?branch=master)](https://travis-ci.org/rgreenjr/atom-elixir-formatter)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

## Description

An [Elixir](https://elixir-lang.org) source code formatter for the Atom editor. It automatically formats
Elixir using the code formatter introduced in Elixir v1.6.

## Requirements

Atom Elixir Formatter requires Elixir v1.6 or later.

## Installation

Open **Settings** ⟶ **Install** and search for `atom-elixir-formatter`.

Alternatively, install through the terminal:

```sh
apm install atom-elixir-formatter
```

## Usage

Elixir files are formatted automatically on save. This can be disabled in
**Settings**, or set to occur only when projects include a `.formatter.exs` file. See the `mix format` [task documentation](https://hexdocs.pm/mix/Mix.Tasks.Format.html#module-formatter-exs) for a list of formatter configuration options supported in `.formatter.exs`.

You can manually format sections of code using the keyboard shortcut
<kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>F</kbd>.

By default, Atom Elixir Formatter uses the `elixir` executable resolved on `$PATH`. You can override this behavior by going to **Settings** ⟶ **Packages** ⟶ **Atom Elixir Formatter** and setting **Elixir Executable** to the absolute path of an `elixir` executable.

![settings](https://raw.githubusercontent.com/rgreenjr/atom-elixir-formatter/master/images/settings.png)

## Maintainers

[Ron Green](https://github.com/rgreenjr)
