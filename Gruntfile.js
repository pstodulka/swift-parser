module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-peg');
	grunt.loadNpmTasks('grunt-newer'); 
	grunt.loadNpmTasks('grunt-contrib-coffee');

    grunt.initConfig({
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['tests/**/*.js']
            }
        },
		peg: {
			grammars: {
			  expand: true,
			  src: ["**/*.peg", "!node_modules/**"],
			  ext: ".js",
			}
        },
        coffee: {
            transform: {
                options: {
                    sourceMap: true,
                    mapExt: ".map" //this can only the forked version of grunt-contrib-coffee
                },
                expand: true,
                src: ["**/*.coffee", "!node_modules/**"],
                ext: ".js"
            }
        }
    });

    grunt.registerTask('test', 'mochaTest');
    grunt.registerTask('build', ['newer:peg', 'newer:coffee']);

    grunt.registerTask('default', 'build');

};