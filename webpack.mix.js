const mix = require('laravel-mix');
const path = require('path');
const tailwindcss = require('tailwindcss');

require('laravel-mix-purgecss');
require('laravel-mix-bundle-analyzer');

mix.disableSuccessNotifications();

mix.webpackConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '+/js/'),
    },
    modules: ['node_modules'],
  },
});

mix.options({
  clearConsole: false,
  hmrOptions: {
    host: 'localhost',
    port: 3000,
  },
  postCss: [require('tailwindcss')],
  processCssUrls: false,
  purifyCss: false,
  terser: {
    terserOptions: {
      compress: {
        drop_console: mix.inProduction(),
      },
    },
  },
});

mix
  .setPublicPath('./')
  // .copyDirectory('+/fonts', 'assets/fonts')
  .js('+/js/customizer.js', 'assets/js')
  .js('+/js/main.js', 'assets/js')
  .sass('+/scss/editor.scss', 'assets/css')
  .sass('+/scss/login.scss', 'assets/css')
  .sass('+/scss/main.scss', 'assets/css')
  .sourceMaps()
  .purgeCss({
    extensions: ['js', 'php'],
    folders: ['assets', 'templates'],
    whitelist: ['active'],
    whitelistPatterns: [
      /^has-/,
      /^in-/,
      /^is-/,
      /^swal/,
    ],
  })
  .version()
  // .browserSync('castor.test');
