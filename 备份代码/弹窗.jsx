import React from 'react';
import CommonController from 'spa/common/controller/CommonController';
import analysis from 'common/component/analysis/habo/index';
import env from 'util/env';
const openApp = require('common/app_wakeup');
const isWeixin = env.thirdapp && env.thirdapp.isWeixin;

require('css-loader!./index.styl');

class GuideAppDownload extends CommonController {
    constructor(props) {
        super(props);
        this.state = {
            showDialog: this.props.showDialog,
        };
    }

    componentDidMount() { }
    componentWillReceiveProps(nextProps) {
        this.setState({
            showDialog: nextProps.showDialog
        });
    }
    // 关闭温馨提示弹窗
    dialogClose = (e) => {
        e.stopPropagation();
        if (this.props.dialogClose) {
            this.props.dialogClose();
        }
        analysis.send({
            event_id: 23491921
        });
    }
    downLoad = (e) => {
        e.stopPropagation();
        analysis.send({
            event_id: 23491957
        });
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
    render() {
        return (
            <div className="guideAP">
                <div className="guideAP-mask" onClick={this.dialogClose}></div>
                <div className="guideAP-box">
                    <div className="verify-phone-box">
                        <p className="guideAP-phone">温馨提示</p>
                        {this.props.content}
                        <div className="guideAP-sure" onClick={this.downLoad}>打开跟谁学APP</div>
                    </div>
                    <div className="close-box" onClick={this.dialogClose}>
                        <span className="icon-Close"></span>
                    </div>
                </div>
            </div>

        );
    }
}
export default GuideAppDownload;