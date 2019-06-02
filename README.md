# Webpack 4 Boilerplate
There is Webpack 4 template you can build the project by it.<br>
This Webpack tool is suitable for combination of multiple small projects.

\# If you want to know more about this project, please see [快速建置常用的 Webpack 4 config & loader](https://github.com/VisionYi/blog/issues/2).

## Features
- automatic minify JS, CSS and HTML
- use preprocessor： `babel`, `scss/sass`, `postcss & autoprefixer`
- static files use `hash` filename to avoid the cache
- use image base64
- use devServer - hot reload for `js`, `html`, `css/scss/sass`
- have many **custom variables*** for CLI, using on the npm scripts
- auto clean the output folder

\# Custom variables: `name`, `entry`, `template`, `output`, `publicPath`
## Requirements
You only need node.js pre-installed.

## Setup
Install plugin dependencies
```bash
$ npm install
```

## Development
Run the local webpack-dev-server with livereload.<br>
Auto-compile on http://localhost:8000/ and use the default project `app`.
```bash
$ npm run start
```

## Building project
You can build the default project `app` by:
```bash
$ npm run build
```

## Create new project
1. Add your folder with the project name, and put it under the basic directory like `example`.

2. Add the main JS file (default name: `index.js`) and HTML template file (default name: `index.html`).

3. Add your npm script content on the package.json `scripts`:
   - On development node, you can write like `"dev:example": "webpack-dev-server --mode development --evn.name=example"`

   - On production node, you can write like `"build:example": "NODE_ENV=production webpack --mode production --evn.name=example"`

   - Otherwise you can set `--env.{variable}={value}` config, there are 5 variables: **name, entry, template, output, publicPath**. ( see `webpack.config.js` to get more details )

4. Start your project coding now.

