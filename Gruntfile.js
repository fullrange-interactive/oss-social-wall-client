module.exports = function (grunt) {
    'use strict';
    // Project configuration
    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= pkg.license %> */\n',
        jade: {
            index: {
                options: {
                    pretty: true,
                },
                files: [
                {
                    src: "wall.jade",
                    dest: "wall.html"
                } ]
            },
            templates: {
                options: {
                    pretty: true,
                },
                files: [ {
                    cwd: "templates/jade",
                    src: "**/*.jade",
                    dest: "templates/html",
                    expand: true,
                    ext: ".html"
                }]
            }      
        },
        filesToJavascript: {
            default_options: {
                options: {
                    inputFilesFolder : 'templates/html',
                    // inputFilePrefix : 'indicator-',
                    // useIndexes : true,
                    // variableIndexMap : {
                    //     'a1-' : 0,
                    //     'b1-' : 1,
                    //     'c1-' : 2,
                    //     'c2-' : 3,
                    //     'c3-' : 4
                    // },
                    outputBaseFile : 'templates/renderjs-templates.js',
                    outputBaseFileVariable : 'renderJsTemplates',
                    outputFile : 'lib/renderjs-templates.js'
                }
            }
        },  
        bower_concat:{
            all: {
                    options: { separator : ";\n" },
                    dest: {
                        "js":"lib/bower-concat.js",
                        "css":"lib/bower-concat.css"
                    },
                    exclude: [ // Alreay included in packery dist
                        'fizzy-ui-utils',
                        'desandro-matches-selector',
                        'outlayer',
                        'ev-emitter',
                        'get-size',
                        'fizzy-ui-utils',
                        'r.js', // For now, don't use requirejs
                        'requirejs'
                    ],
                    dependencies: {
                        'jsrender': ['jquery'],
                        'packery': ['jquery'],
                        'masonry' : ['jquery'] 
                    },                        
                    mainFiles: {
                        'font-awesome':["css/font-awesome.css"],                        
                        'packery':["dist/packery.pkgd.js"],
                        'masonry':["dist/masonry.pkgd.js"]
                    }  
            }
        },
        // Concat all lib/*.js files into a single package
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: [
                    'lib/bower-concat.js',
                    'lib/common.js',
                    'lib/renderjs-templates.js',
                    'lib/websocketConnection.js',
                    'lib/ajaxConnection.js',                    
                    'lib/contentView.js',
                    'lib/bannerView.js',
                    'lib/contentList.js',
                    'lib/displayedContentList.js',
                    'lib/selectedContentList.js',
                    'lib/pinnedContentList.js',
                    'lib/socialWallClient.js',
                    'lib/twemoji.min.js'
                    // lib/*.js'
                    ], 
                dest: 'dist/social-wall-client.js'
            }
        },
        concat_css: {
            options: {
                // Task-specific options go here. 
            },
            all: {
                src: ["*.css","lib/*.css"],
                dest: "dist/styles.css"
            }
        },                
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/social-wall-client.min.js'
            }
        },
        jshint: {
            options: {
                node: true,
                curly: false,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                eqnull: true,
                browser: true,
                globals: { jQuery: true },
                boss: true
            },
            gruntfile: {
                src: 'gruntfile.js'
            },
            lib_test: {
                src: ['lib/**/*.js', 'test/**/*.js']
            }
        },
        qunit: {
            files: ['test/**/*.html']
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            // lib_test: {
            //     files: '<%= jshint.lib_test.src %>',
            //     tasks: ['jshint:lib_test', 'qunit']
            // },
            scripts: {
                files: ['templates/**/*.jade','wall.jade','lib/*.js','lib/*.css','templates/*.js'],
                tasks: ['build'],
                options: {
                    spawn: false,
                    livereload: 35729
                },
            }           
        }
    });

    // These plugins provide necessary tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-files-to-javascript-variables');    
    grunt.loadNpmTasks('grunt-concat-css');    

    // Default task
    grunt.registerTask('default', ['jade:templates','filesToJavascript','bower_concat','concat','concat_css','uglify','jade:index']);
    grunt.registerTask('build', ['jade:templates','filesToJavascript','bower_concat','concat','concat_css','jade:index']);

};

