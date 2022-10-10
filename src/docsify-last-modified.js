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

    hook.beforeEach(async function (markdown, next) {
        var time = '{docsify-updated}';
        var text = '';
        if (CONFIG.repo !== '') {
            try {
                var date_url = 'https://api.github.com/repos/' + CONFIG.repo + '/commits?per_page=1';

                if (CONFIG.basePath !== '') {
                  date_url = date_url + '&path=' + CONFIG.basePath + vm.route.file;
                }

                await fetch(date_url).then((response) => {
                    return response.json();
                }).then((commits) => {
                    console.error(commits);
                    if (commits.length > 0) {
                        time = tinydate(CONFIG.dateFormat)(new Date(commits[0]['commit']['committer']['date']));
                    }
                });
            } catch (err) {
                text = err;
            }
        }

        text = CONFIG.preString + time;
        markdown = 'top' !== CONFIG.whereToPlace ? markdown + '\n\n' + text : text + '\n\n' + markdown;
        next(markdown);
    });
};

$docsify.plugins = [].concat(install, $docsify.plugins);
