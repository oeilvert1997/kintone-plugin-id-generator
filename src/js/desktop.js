(function(PLUGIN_ID) {
    'use strict';

    // Plugin設定の取得
    const config = kintone.plugin.app.getConfig(PLUGIN_ID);
    const prefix = config.prefix || '';
    const fieldCode = config.fieldCode;

    kintone.events.on(['app.record.create.submit'], async (event) => {
    
        // fieldCodeが設定されていない場合は終了
        if (!fieldCode) return event;
            
        // 最新レコードの取得
        const query = `${fieldCode} != "" and $created_at = THIS_MONTH() order by ${fieldCode} desc limit 1`;
        const body = { app: kintone.app.getId(), query };
        
        try {
            const response = await kintone.api(kintone.api.url('/k/v1/records.json', true), 'GET', body);
            
            const now = new Date();
            const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
            let nextSeq = 1;

            if (response.records.length > 0) {
                const latestValue = response.records[0][fieldCode].value;
                const parts = latestValue.split('-');
                const lastSeq = parts[parts.length -1];
                if (!isNaN(lastSeq)) nextSeq = Number(lastSeq) + 1;
            }
            
            const formattedSeq = `${prefix}${datePart}-${String(nextSeq).padStart(4, '0')}`;
            event.record[fieldCode].value = formattedSeq;
            
            return event;
        } catch (error) {
            console.error(error);
            event.error = "採番エラー: " + error.message;
            return event;
        }
    });
})(kintone.$PLUGIN_ID);