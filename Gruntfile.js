module.exports = function(grunt) {
    // Do grunt-related things in here
    grunt.initConfig({
    	pkg: grunt.file.readJSON('package.json'),
    	clean: ['build', 'NewTabNotes.zip'],
    	jshint: {
    		files: ['js/new-tab-notes.js'],
    		options: {
    			loopfunc: true,
    			globals: {
    				jQuery: true,
    				console: true
    			}
    		}
    	},
    	uglify: {
    		options: {
    			banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
    		},
    		dist: {
    			files: [
    			    {
    			    	expand: true,
    			    	src: ['js/*.js'],
    			    	dest: 'build/'
    			    }
    			]
    		}
    	},
    	cssmin: {
    		dist: {
    			files: {
    				'build/styles/new-tab-notes.css' : ['styles/new-tab-notes.css'],
    			}
    		}
    	},
    	htmlmin: {
    		dist: {
    			options: {
    			  removeComments: true,
    			  collapseWhitespace: true
    			},
    			files: [
    			    {
    			    	expand: true,
    			    	src: ['html/**/*.html'],
    			    	dest: 'build/'
    			    }
    			]
    		}
    	},
    	copy: {
    		everything: {
    			files: [
    			    {
    			    	expand: true,
    			    	src: [
    			    	    'images/**/*.png',
                            'images/**/*.ico',
    			    	    'styles/*.css',
    			    	    'scripts/*.js',
    			    	    'fonts/*',
    			    	    'manifest.json'
    			    	],
    			    	dest: 'build/'
    			    }
    			]
    		}
    	},
    	compress: {
    		dist: {
    			options: {
    				archive: 'NewTabNotes.zip'
    			},
    			files: [
    			    {
    			    	src: ['build/**'],
    			    	dest: ''
    			    }
    			]
    		}
    	}
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('default', [
    	'clean',
    	'jshint',
    	'uglify',
    	'cssmin',
    	'htmlmin',
    	'copy',
    	'compress'
    	]);
};