(function(PLUGIN_ID) {
    'use strict';

    const saveButton = document.getElementById('save-button');
    const prefixInput = document.getElementById('prefix-input');
    const fieldInput = document.getElementById('field-code-input');

    const config = kintone.plugin.app.getConfig(PLUGIN_ID);
    if (config.prefix) prefixInput.value = config.prefix;
    if (config.fieldCode) fieldInput.value = config.fieldCode;

    saveButton.onclick = function() {
        const configData = {
            prefix: prefixInput.value,
            fieldCode: fieldInput.value
        };

        kintone.plugin.app.setConfig(configData, () => {
            alert("設定を保存しました。アプリを更新してください。");
            window.location.href = '/k/admin/app/flow?app=' + kintone.app.getId();
        });
    };
})(kintone.$PLUGIN_ID);