(function() {
  'use strict';
  module.exports = function (grunt) {
    var iniparser = require('iniparser');
    var compassSettings = iniparser.parseSync('./config.rb') || undefined;

    var options = {
      port: 9088,
      lrport: 9099,
      html: compassSettings.http_path,
      css: compassSettings.css_dir,
      sass: compassSettings.sass_dir,
      img: compassSettings.images_dir,
      js: compassSettings.javascripts_dir,
      fonts: compassSettings.fonts_dir
    };
    // Remove quotes from options
    for (var k in options) {
      if (typeof(options[k]) === 'string') {
        options[k] = options[k].replace(/"/g, '');
        options[k] = options[k].replace(/'/g, '');
      }
    }

    grunt.initConfig({
      connect: {
        server: {
          options: {
            port: options.port,
            base: options.html,
            livereload: options.lrport
          }
        }
      },

      open: {
        dev: {
          path: 'http://localhost:' + options.port
        }
      },

      watch: {
        options: {
          livereload: options.lrport
        },
        html: {
          files: [options.html + '{,**/}*.html']
        },
        css: {
          files: [options.html + options.css + '/{,**/}*.css']
        },
        js: {
          files: [
            options.html + options.js + '/{,**/}*.js',
            '!' + options.html + options.js + '/{,**/}*.min.js'
          ],
          tasks: ['jshint']
        },
        img: {
          files: [options.html + options.img + '/{,**/}*.*']
        }
      },

      compass: {
        options: {
          relativeAssets: true,
          bundleExec: true,
          config: 'config.rb',
          watch: true
        },
        dev: {
          watch: true
        }
      },

      jshint: {
        options: {
          jshintrc: '.jshintrc'
        },
        all: [
          options.html + options.js + '/{,**/}*.js',
          '!' + options.html + options.js + '/{,**/}*.min.js'
        ]
      },

      parallel: {
        dev: {
          options: {
            grunt: true,
            stream: true
          },
          tasks: ['watch', 'compass']
        }
      },

      //////////////////////////////
      // Usemin
      //////////////////////////////
      useminPrepare: {
        html: 'index.html',
        options: {
          dest: './.dist/'
        }
      },
      usemin: {
        html: './build/index.html',
        options: {
          dest: './.dist/'
        }
      },

      //////////////////////////////
      // Copy
      //////////////////////////////
      copy: {
        build: {
          files: [
            {
              expanded: true,
              src: ['index.html', 'CNAME', 'fonts/**', 'data/**', 'partials/**'],
              dest: './.dist/'
            }
          ]
        }
      },

      //////////////////////////////
      // Clean
      //////////////////////////////
      clean: ['./.dist'],

      //////////////////////////////
      // Subtree Push
      //////////////////////////////
      exec: {
        add: {
          cmd: 'git add .dist && git commit -m "Dist Commit"'
        },
        subtree: {
          cmd: 'git subtree push --prefix .dist origin gh-pages'
        },
        remove: {
          cmd: 'git reset HEAD^'
        }
      }

    });

    // Match Grunt dependencies
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    //////////////////////////////
    // Serve Task
    //////////////////////////////
    grunt.registerTask('serve', 'Development Server', function() {
      grunt.task.run(['connect:server']);

      if (grunt.option('launch')) {
        grunt.task.run(['open:dev']);
      }
      grunt.task.run(['parallel:dev']);
    });

    //////////////////////////////
    // Test Task
    //////////////////////////////
    grunt.registerTask('test', function() {
      console.log('Test!');
    });

    grunt.registerTask('build', function() {
      grunt.task.run(['clean', 'useminPrepare', 'concat', 'cssmin', 'uglify', 'copy:build', 'usemin']);
    });

    grunt.registerTask('deploy', function() {
      grunt.task.run(['exec:add', 'exec:subtree', 'exec:remove', 'clean']);
    });

    grunt.registerTask('build-deploy', function() {
      grunt.task.run(['build', 'deploy']);
    });

  };
})();
