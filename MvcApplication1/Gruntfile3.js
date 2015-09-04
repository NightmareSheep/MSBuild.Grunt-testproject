module.exports = function(grunt) {
	'use strict';
	
	// All scss and js files; these will be watched by the watch script
	var scssSrcFiles = [
						'Content/scss/core.scss', 
						'Content/scss/*.scss',
						'Content/scss/**/*.scss', 
						'Content/components/**/*.scss',
						];
	var jsSrcFiles = [
						'Scripts/*.js', 
						'Scripts/**/*.js',
						'Scripts/**/**/*.js'
					];

	var htmlSrcFiles = [
						'Views/**/*.cshtml'
	                ];

	var htmlSiteSpecificSrcFiles = [
	                    '../**/Areas/**/Views/**/*.cshtml'
                    ];

	var imgSrcFiles = [
						'Content/assets/img/*.jpg', 
						'Content/assets/img/*.png',
						'Content/assets/img/*.svg'
					];

	var fontSrcFiles = [
						'Content/assets/fonts/*.{eot,woff,ttf,svg}'
					];
	
	
	// Vars for the build folder
	var buildFolder = '../../build/Website/';

	var buildFolders = {
		js: buildFolder+'Scripts/',
		libs: buildFolder+'Scripts/libs',
		css: buildFolder+'Content/',
		img: buildFolder+'Content/assets/img'
		
	};
	
	// Let's create a folder outside of the sitecore folder so the git files won't conflict
	var styleguideFolder = '../../../vvv-styleguide/';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

		
		//-- Start Sass task - Process SASS/SCSS to CSS and put in build folder. Please note we are using grunt-sass (c++) instead of grunt-contrib-sass. 
		// Grunt-Sass is needed for the grunt on build functionality in visual studio. 
		// Docs: https://github.com/sindresorhus/grunt-sass
		sass: {
			compile: {
				options: {
					sourceMap: true
					// outputStyle: 'compressed'
				},
				files: 
					{ 'core.css' : 'Content/scss/core.scss'} 				
			},
			fxm: {
				options: {
					sourceMap: false
					// outputStyle: 'compressed'
				},				
				files:
					{'fxm.css' : 'Content/scss/fxm.scss'}
			}
		},

		
		//-- Start copy task - copy files to build folder
		copy: {
            cshtml: {
		        src: htmlSrcFiles, 			// copy all files and subfolders
		        dest: buildFolder,    		// destination folder
		        expand: true           		// required when using cwd
            },
            chtmlsitespecific: {
		        src: htmlSiteSpecificSrcFiles,
		        dest: buildFolder,
                //rename: strips the first two folders from the source path (wich are site specific)
		        rename: function (dest, src) {
		            var renameDest = src.substring(src.indexOf('/') + 1);
		            return dest + renameDest.substring(renameDest.indexOf('/') + 1);
		        },
		        expand: true
		    },
			img: {
				src: imgSrcFiles,
				dest: buildFolder,
				expand: true
			},
			js: {
				src: jsSrcFiles,
				dest: buildFolder,
				expand: true
			},
			fonts: {
				src: fontSrcFiles,
				dest: buildFolder,
				expand: true
			},
			copyStyleguide: {
				src: [scssSrcFiles, imgSrcFiles, jsSrcFiles, fontSrcFiles, '!Scripts/**/ko.*'],
				dest: styleguideFolder,
				rename: function (dest, src) {
		   			return dest + 'app/' + src;
		        },
				expand: true
			}
		},
		
		
		//-- Start Autoprefixer task - Add vendor-prefixed CSS using Can I Use database.
		// Docs: https://github.com/nDmitry/grunt-autoprefixer
		autoprefixer: {
			core: {
				options: {
					browsers: ['last 2 versions', 'ie 8', 'ie 9', 'Firefox >= 25'],
					map: true,
					cascade: false
				},
				src: buildFolders.css+'core.css',
				dest: buildFolders.css+'core.css'
			}
		},

		
		//-- Start JSHint task - Check JS files and display errors in console.
		// Docs: https://github.com/gruntjs/grunt-contrib-jshint
		// Options: http://www.jshint.com/docs/
		jshint : {
			files: 'Scripts/*.js',
			options: {
				undef: true,
				debug: true,
				unused: false,
				loopfunc: true,
				browser: true,
				devel: true,
				jquery: true,
				globals: {
				    ko: true,
					console: true,
					owl: true,
					Modernizr: true,
					google: true,
					debounce: true,
					Extensions: true
				}
			}
		},	
		
		
		//-- Concatenate plugin libraries.		
		concat: {
			options: {
				separator: ';',
			},
			dist: {
				src: 'Scripts/libs/plugins/*.js',
				dest: 'Scripts/libs/plugins.js',
			},
		},
		
		
//		//-- Start Bower concatenate task - Concatenate Bower dependencies.
//		// Docs: https://github.com/sapegin/grunt-bower-concat
//		bower_concat: {
//			all: {
//				exclude: [
//					'jquery-legacy'
//				],
//				dependencies: {
//					'modernizr': 'jquery',
//					'jquery.cookie': 'jquery'
//				},
//				dest: 'scripts/libs/libs.js',
//				cssDest: 'content/scss/libs/_libs.scss'
//			},
//			allForLegacyBrowsers: {
//				exclude: [
//					'jquery'
//				],
//				dependencies: {
//					'modernizr': 'jquery-legacy',
//					'jquery.cookie': 'jquery'
//				},
//				dest: 'scripts/libs/libs-legacy-browsers.js',
//				cssDest: 'content/scss/libs/_libs.scss'
//			}
//		},
//		//-- End bower_concat		
		

		//-- Start Notify task - Notify user when Grunt finishes a task.
		// Docs: https://github.com/dylang/grunt-notify
		notify: {
			watchCss: {
				options: {
					title: 'scss processed',
					message: '✔ css files created'
				}
			},
			watchJs: {
				options: {
					title: 'js processed',
					message: '✔ js files created'
				}
			},
			assets: {
				options: {
					title: 'assets processed',
					message: '✔ assets created'
				}
			}		
		},
		
		
		//-- SCSS lint --//
		scsslint: {
			allFiles: [
//				'Content/scss/*.scss'
//				'Content/scss/components/*.scss',
//				'Content/scss/dependencies/*.scss',
//				'Content/scss/foundation/*.scss',
//				'Content/scss/libs/*.scss',
				'Content/scss/modules/*.scss',
			],
			options: {
			      reporterOutput: 'scss-lint-report.xml',
			      colorizeOutput: true
			},
		},
		
		versioncheck: {
			options: {
			  skip : ["semver", "npm", "lodash"],
			  hideUpToDate : false
			}
		},
	
		//-- Start watch task 
		watch: {
		    sass: {
		        files: scssSrcFiles,  
		        tasks: ['sass', 'autoprefixer:core', 'notify:watchCss'],
		        options: {
		            livereload: true
		        }
		    },
			
		    chtml: {
		        files: htmlSrcFiles,
		        tasks: ['newer:copy'],
		        options: {
		            livereload: true
		        },		
		    },

		    chtmlsitespecific: {
		        files: htmlSiteSpecificSrcFiles,
		        tasks: ['newer:copy'],
		        options: {
		            livereload: true
		        }			
		    },
			
			js: {
				files: jsSrcFiles,
				tasks: ['jshint', 'notify:watchJs', 'newer:copy', 'newer:concat'],
		        options: {
		            livereload: true
		        }		
			},
			
			img: {
				files: imgSrcFiles,
				tasks: ['newer:copy', 'notify:assets'],
				options: {
					livereload: true
				}
			},
			
			fonts: {
				files: fontSrcFiles,
				tasks: ['newer:copy'],
				options: {
					livereload: true
				}
			}
		},
						 
    }); 

    //load plugins
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-autoprefixer'); 
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-scss-lint');
	grunt.loadNpmTasks('grunt-version-check');

	grunt.registerTask('default', [
	    'watch'
	]);

    grunt.registerTask('build', [
        'sass','autoprefixer', 'concat'
    ]);

    grunt.registerTask('styleguide', [
        'copy:copyStyleguide'
    ]);
};