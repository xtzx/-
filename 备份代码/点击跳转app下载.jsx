jumpPageApp = () => {
        let androidUrl;
        const iosUrl = 'https://itunes.apple.com/cn/app/id919947654?mt=8';
        let skipUrl;
        if (isWeixin) {
            androidUrl = 'https://m.genshuixue.com/app/dw?t=s&ct=GenShuiXue_M2100013';
            skipUrl = env.os.isIOS ? iosUrl : androidUrl;
            location.href = skipUrl;
        } else {
            const schemaUrl = 'bjhlstudent://o.c';
            openApp({
                type: 'internal',
                url: decodeURIComponent(schemaUrl)
            }, function (isSuccess) {
                if (!isSuccess) {
                    androidUrl = 'https://d.gsxservice.com/app/genshuixue.apk?ct=';
                    skipUrl = env.os.isIOS ? iosUrl : androidUrl;
                    location.href = skipUrl;
                }
            });
        }
    }
    
    
const env = require('util/env');
const isWeixin = env.thirdapp && env.thirdapp.isWeixin;