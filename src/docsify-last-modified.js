var CONFIG = {
    repo: '',
    basePath: 'docs/',
    preString: '> last update time: ',
    dateFormat: '{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}',
    whereToPlace: 'top',
};

var install = function (hook, vm) {
    var opts = vm.config.lastModified || CONFIG;
    CONFIG.repo = opts.repo && typeof opts.repo === 'string' ? opts.repo : CONFIG.repo;
    CONFIG.basePath = opts.basePath && typeof opts.basePath === 'string' ? opts.basePath : CONFIG.basePath;
    CONFIG.preString = opts.preString && typeof opts.preString === 'string' ? opts.preString : CONFIG.preString;
    CONFIG.dateFormat = opts.dateFormat && typeof opts.dateFormat === 'string' ? opts.dateFormat : CONFIG.dateFormat;
    CONFIG.whereToPlace = opts.whereToPlace && typeof opts.whereToPlace === 'string' ? opts.whereToPlace : CONFIG.whereToPlace;

    hook.beforeEach(function(html) {
        var time = '{docsify-updated}';
        if (CONFIG.repo !== '') {
            var date_url = 'https://api.github.com/repos/' + CONFIG.repo + '/commits?per_page=1';
            
            if (CONFIG.basePath !== '') {
                date_url = date_url + '&path=' + CONFIG.basePath + vm.route.file;
            }
            fetch(date_url).then((response) => {
              return response.json();
            }).then((commits) => {
                if (commits.length > 0) {
                    time = tinydate(CONFIG.dateFormat)(new Date(commits[0]['commit']['committer']['date']));
                }
            });
        }
        
        var text = CONFIG.preString + time;

        return 'top' !== CONFIG.whereToPlace ? html + '\n\n' + text : text + '\n\n' + html;
    });
};

$docsify.plugins = [].concat(install, $docsify.plugins);
