module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'Content/test.css': 'Content/test.scss'
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  
  grunt.registerTask('default', ['sass']);
  grunt.registerTask('build', ['sass']);

};