
;(function() {

    var base = MODULE_PATH + '/js/';

    AUI().applyConfig(
            {
                groups: {
                    mymodulesoverride: { //mymodulesoverride
                        base: base,
                        combine: Liferay.AUI.getCombine(),
                        filter: Liferay.AUI.getFilterConfig(),
                        modules: {
                            'liferay-portlet-journal-test': { //my-module-override
                                path: 'main-override.js', //my-module.js
                                condition: {
                                    name: 'liferay-portlet-journal-test', //my-module-override
                                    trigger: 'liferay-portlet-journal', //original module
                                    when: 'instead'
                                }
                            },
                            'liferay-portlet-blogs-test': { //my-module-override
                                path: 'blogs-override.js', //my-module.js
                                condition: {
                                    name: 'liferay-portlet-blogs-test', //my-module-override
                                    trigger: 'liferay-blogs', //original module
                                    when: 'instead'
                                }
                            }
                        },
                        root: base
                    }
                }
            }
    );
})();
