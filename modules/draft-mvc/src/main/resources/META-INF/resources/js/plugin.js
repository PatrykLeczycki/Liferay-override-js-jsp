window.saveDraft = function() {

    var form = $('form#_com_liferay_journal_web_portlet_JournalPortlet_fm1');

    var titleMap = form.find("input[id^='_com_liferay_journal_web_portlet_JournalPortlet_titleMapAsXML_']");

    var titleMapToString = '{';

    Array.prototype.forEach.call(titleMap, entry => {
        var lang = entry.id.slice(-5);
        var title = entry.value;

        titleMapToString += '"' + lang + '":"' + title + '",';
    });
    titleMapToString = titleMapToString.slice(0, -1);
    titleMapToString += '}';

    var friendlyUrlMap = form.find("input[id^='_com_liferay_journal_web_portlet_JournalPortlet_friendlyURL_']");

    var friendlyUrlMapToString = '{';

    Array.prototype.forEach.call(friendlyUrlMap, entry => {
        var lang = entry.id.slice(-5);
        var url = entry.value;

        friendlyUrlMapToString += '"' + lang + '":"' + url + '",';
    });

    friendlyUrlMapToString = friendlyUrlMapToString.slice(0, -1);
    friendlyUrlMapToString += '}';

    console.log('titleMapToString = ' + titleMapToString);
    console.log('friendlyUrlMapToString = ' + friendlyUrlMapToString);

    var articleId = form.find('#_com_liferay_journal_web_portlet_JournalPortlet_articleId').attr('value');

    var groupId = form.find('#_com_liferay_journal_web_portlet_JournalPortlet_groupId').attr('value');

    var status = form.find('#_com_liferay_journal_web_portlet_JournalPortlet_workflowAction').attr('value');

    Liferay.Service(
            '/journal.journalarticle/get-latest-article',
            {
                groupId: groupId,
                articleId: articleId,
                status: status
            },
            function (obj) {
                console.log(obj);
                //obj.content = '<?xml version=\\"1.0\\"?>\\n\\n<root available-locales=\\"en_US\\" default-locale=\\"en_US\\">\\n\\t<dynamic-element name=\\"content\\" type=\\"text_area\\" index-type=\\"text\\" instance-id=\\"rzqj\\">\\n\\t\\t<dynamic-content language-id=\\"en_US\\"><![CDATA[<p>' + new Date() +'</p>]]></dynamic-content>\\n\\t</dynamic-element>\\n</root>';

                console.log(
                        '<?xml version="1.0"?><root available-locales="en_US" default-locale="en_US"><dynamic-element name="content" type="text_area" index-type="text" instance-id="rzqj"><dynamic-content language-id="en_US"><![CDATA[<p>'
                        + new Date() + '</p>]]></dynamic-content></dynamic-element></root>');
                Liferay.Service(
                        '/journal.journalarticle/update-content',
                        {
                            groupId: obj.groupId,
                            articleId: obj.articleId,
                            version: obj.version,
                            content: '<?xml version="1.0"?><root available-locales="en_US" default-locale="en_US"><dynamic-element name="content" type="text_area" index-type="text" instance-id="rzqj"><dynamic-content language-id="en_US"><![CDATA[<p>'
                                    + new Date() + '</p>]]></dynamic-content></dynamic-element></root>'
                        },
                        function (obj) {
                            console.log('update = ', obj);
                        }
                );
            }
    );
};