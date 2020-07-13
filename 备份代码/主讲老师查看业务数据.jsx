/**
 * 主讲老师查看业务数据
 * @author AashLeo
 */
import React from 'react';
import ajaxService from 'common/util/ajaxService';
import ajaxConfig from 'common/ajaxConfig';
import Loading from 'common/components/Loading/index';
import PageController from 'common/controller/PageController';
import { DatePicker } from 'antd';
import moment from 'moment';
import Notice from 'common/components/Notice/index';
require('css-loader!./index.styl');
const yesterdayMoment = moment(new Date()).subtract(1, 'days');
class TeacherData extends PageController {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            businessData: {},
            startValue: yesterdayMoment,
            endValue: yesterdayMoment,
            // startValue: null,
            // endValue: null,
            endOpen: false,
        };
        this.yesterday = this.getMyDay();
    }

    // 获取老师业务数据
    getDataList = () => {
        this.setState({
            isLoading: true
        });
        const { startValue, endValue } = this.state;
        if (!(startValue && endValue)) {
            this.Notice.notice('请选择时间！');
            this.setState({ isLoading: false });
            return;
        }
        const startTime = this.dataTransfrom(startValue);
        const endTime = this.dataTransfrom(endValue);
        ajaxService
            .get(ajaxConfig.TEACHERDATA.BUSINESEDATA, {
                beginTime: startTime,
                endTime: endTime
            })
            .then((res) => {
                this.setState({
                    isLoading: false,
                    businessData: res.data
                });
            });
    }

    // 获取日期，第一个表示距离今天的时间，-1表示昨天，1表示明天，类推，第二个表示分隔符，默认‘-’
    // 同时给取昨天的value值（毫秒数）this.yesterdayValue
    getMyDay = (num, str = '-') => {
        const day = new Date();
        const nowTime = day.getTime();
        const ms = 24 * 3600 * 1000 * num;
        day.setTime(nowTime + ms);
        const oYear = day.getFullYear();
        let oMoth = (day.getMonth() + 1).toString();
        if (oMoth.length <= 1) oMoth = '0' + oMoth;
        let oDay = day.getDate().toString();
        if (oDay.length <= 1) oDay = '0' + oDay;
        return (oYear + str + oMoth + str + oDay);
    }

    // 选择开始时间禁用项目，时间大于结束时间,已经对开始时间不做设置禁用
    // disabledStartDate = (startValue) => {
    //     const endValue = this.state.endValue;
    //     if (!startValue || !endValue) {
    //         return false;
    //     }
    //     return startValue.valueOf() > endValue.valueOf();
    // }

    // 开始时间必须小于昨天，开始时间，结束时间都要小于昨天
    disabledStartDate = (startValue) => {
        this.yesterdayMoment = moment(new Date()).subtract(1, 'days');
        if (!startValue) {
            return false;
        }
        return startValue.valueOf() > this.yesterdayMoment.valueOf();
    }

    // 选择结束时间禁用项目，时间小于结束时间
    // 没有选择开始时间的前提下无法禁用
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        this.yesterdayMoment = moment(new Date()).subtract(1, 'days');
        if (!endValue || !startValue) {
            return false;
        }
        return (endValue.valueOf() < startValue.valueOf() || endValue.valueOf() > this.yesterdayMoment.valueOf());
    }

    // 讲moment格式的对象转成2018-12-1-12-10格式的时间
    // 改传毫秒数
    dataTransfrom = (time) => {
        // return moment(time).format('gggg-MM-D-HH-mm');
        return time.valueOf();
    }

    test = (val) => {
        const a = new Date();
        a.setTime(val);
        console.log(a.getDate());
        // return a.getDate();
    }

    // 选择时间发生变化的时候（公用函数）
    onChange = (field, value) => {
        this.setState({ [field]: value }, () => {
            if (this.state.endValue
                &&
                this.state.startValue
                &&
                (this.dataTransfrom(this.state.startValue) > this.dataTransfrom(this.state.endValue))) {
                console.log(1);
                this.setState({
                    endValue: yesterdayMoment
                });
            }
        });
    }

    // 开始时间变化
    onStartChange = (value) => {
        this.onChange('startValue', value);
    }

    // 结束时间变化
    onEndChange = (value) => {
        this.onChange('endValue', value);
    }

    // 点击出现弹窗状态的改变
    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }

    // 保证点击开始日期以后自动打开结束日期
    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }

    // 'xxx.xx'数字转成千分位, 注意带小数点的必须两位
    addCommas = (num) => {
        const numStr = num.toString();
        if (numStr.indexOf('.') !== -1) {
            const numCommasAfter = numStr.slice(-3);
            let numCommasBefore = numStr.slice(0, -3);
            numCommasBefore = numCommasBefore.replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) { return s + ','; });
            return numCommasBefore + numCommasAfter;
        }
        return numStr.replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) { return s + ','; });
    }

    render() {
        const {
            isLoading,
            startValue,
            endValue,
            endOpen
        } = this.state;
        let {
            nonpublicCount = 0,
            paymentAmount = 0,
            refundCount = 0,
            refundAmount = 0,
            confirmAmount = 0
        } = this.state.businessData;
        confirmAmount = this.addCommas(confirmAmount);
        paymentAmount = this.addCommas(paymentAmount);
        nonpublicCount = this.addCommas(nonpublicCount);
        refundAmount = this.addCommas(refundAmount);
        refundCount = this.addCommas(refundCount);


        confirmAmount = this.addCommas(confirmAmount);
        return (
            <div className="date-wrapper">

                <div className="title">
                    <span className="title-text">业务数据</span>
                    <span className="btn-refresh" onClick={self.getCourseList}>
                        <img src="https://imgs.genshuixue.com/0cms/d/file/content/2018/08/5b73d49e23b8f.png" />
                        刷新列表
                    </span>
                </div>

                {this.state.businessData
                    ?
                    (<div>
                        <header className="select-time-range">
                            <span className="set-margin">开始日期:</span>
                            <DatePicker
                                defaultValue={yesterdayMoment}
                                className="timePicker"
                                format="YYYY-MM-DD"
                                disabledDate={this.disabledStartDate}
                                style={{
                                    width: 166,
                                    height: 40,
                                    borderRadius: 4,
                                }}
                                value={startValue}
                                placeholder={this.yesterday}
                                onChange={this.onStartChange}
                                onOpenChange={this.handleStartOpenChange}
                                allowClear={false}
                                showToday={false}
                            />
                            <span className="set-margin">结束日期:</span>
                            <DatePicker
                                defaultValue={yesterdayMoment}
                                className="timePicker"
                                format="YYYY-MM-DD"
                                disabledDate={this.disabledEndDate}
                                style={{
                                    width: 166,
                                    height: 40,
                                    borderRadius: 4,
                                }}
                                value={endValue}
                                placeholder={this.yesterday}
                                onChange={this.onEndChange}
                                open={endOpen}
                                onOpenChange={this.handleEndOpenChange}
                                allowClear={false}
                                showToday={false}
                            />
                            <div className="serach-btn" onClick={this.getDataList}>查询</div>
                        </header>
                        <main className="money-wrapper">
                            <ul>
                                <li className="money-teacher-no1">
                                    <div>新增课消金额</div>

                                    <span className="num-data">{confirmAmount}</span>
                                    <span className="rmb-logo">￥</span>
                                </li>
                                <li className="money-teacher-no2">
                                    <div>新增实付金额</div>
                                    <span className="num-data">{paymentAmount}</span>
                                    <span className="rmb-logo">￥</span>
                                </li>
                                <li className="money-teacher-no3 special">
                                    <div>新增订单数</div>
                                    <span className="num-data">{nonpublicCount}</span>
                                </li>
                                <li className="money-teacher-no4">
                                    <div>新增退款金额</div>
                                    <span className="num-data">{refundAmount}</span>
                                    <span className="rmb-logo">￥</span>
                                </li>
                                <li className="money-teacher-no5 special">
                                    <div>新增退班数</div>
                                    <span className="num-data">{refundCount}</span>
                                </li>
                            </ul>
                        </main>
                        <section className="note-remind">
                            <span>*</span>
                            <span>以上数据仅供参考，不代表您的实际课酬收入，实际课酬会根据约定的分成比例进行计算</span>
                        </section>
                        <footer className="footer-wrapper">本页面内容最终解释权归跟谁学所有</footer>
                        <Loading visible={isLoading} />
                    </div>)
                    :
                    ''}
                <Notice
                    ref={(that) => {
                        this.Notice = that;
                        // console.log(that);
                    }}
                />
            </div>
        );
    }
};

export default TeacherData;