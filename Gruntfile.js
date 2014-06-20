module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-peg');
	grunt.loadNpmTasks('grunt-newer');

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
			  src: "*.pegjs",
			  ext: ".js",
			}
		}
    });

    grunt.registerTask('default', 'mochaTest');
    grunt.registerTask('test', 'mochaTest');
    grunt.registerTask('pegs', 'newer:peg');

};