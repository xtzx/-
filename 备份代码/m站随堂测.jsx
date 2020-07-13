/**
 * m站随堂测验弹窗
 * @author ming
 */

import React from 'react';
import PageController from 'spa/common/controller/PageController';
// import service from 'spa/common/util/service';
// import ajaxConfig from 'spa/common/ajaxConfig';
import url from 'util/url';
import AnswerHints from './components/answerHints/index';
import FloatingWindow from './components/floatingWindow/index';

require('css-loader!./index.styl');

const { options, rightOptions, time, type, questionId, questionGroupId } = url().params;
// 直接获取url中字段，分别对应选项字符串(<=6)，正确选项(都要大写)，倒计时时间，单选还是多选类型(one,more)，题目id，题组id
// ?options=ABCDEF&rightOptions=A&time=30&type=one&questionId=23424&questionGroupId=1344
export default class classTestIn extends PageController {
    constructor(props) {
        super(props);
        this.state = {
            list: [],                       // 从url获取的选项组成新的对象包含name，active字段组成新的数组
            listChoice: '',                 // 用户选中的选项组成新的字符串
            whetherIsRight: 2,              // 学生答题状态，答对，答错，未作答分别对应0，1，2
            choiceState: true,              // 选项卡是否显示状态，默认显示
            answerHintsState: false,        // 点击提交后出现的提示框状态，默认隐藏
            floatingWindowState: false,     // 点击x后的悬浮框状态，默认隐藏
            countDownTime: time,            // 计时器倒计时显示的时间，数字或者字符串
            optionsAcount: '',               // 选项数量是否大于四个,boolean
        };
    }

    componentDidMount = () => {
        this.getOptions();
        this.countDown();
    }

    shouldComponentUpdate() {
        return true;
    }

    /**
     * 选项点击事件，根据type字段判断多选单选，设置active取反
     * 异步执行添加active选项方法
     * @param {number} index 索引
     */
    handleClick = index => () => {
        const list = this.state.list;
        if (type === 'one') {
            list.forEach(val => (
                val.active = false
            ));
        }
        list[index].active = !list[index].active;
        this.setState(
            list
        );
        setTimeout(() => { this.activeList(); }, 0);
    }

    /**
     * 将active的选项添加到listChoice，字符串拼接。然后排序。
     * 要先清空listChoice不然有bug
     */
    activeList = () => {
        let { listChoice } = this.state;
        listChoice = '';
        const { list } = this.state;
        list.forEach((val) => {
            // eslint-disable-next-line no-unused-expressions
            val.active && (listChoice += val.name);
        });
        listChoice = this.stringSort(listChoice);
        this.setState({
            listChoice
        });
    }

    /**
     * 获取选项，并且转成对象，用数组容纳
     */
    getOptions = () => {
        const listTemp = options.split('');
        const list = listTemp.map((val, index) => {
            return {
                name: val,
                active: false,
                index: index
            };
        });
        const optionsAcount = (options.length > 4);
        this.setState({
            list,
            optionsAcount,
        });
    }

    /**
     * 点击提交，执行判断方法
     */
    submitAnswer = () => {
        // const { listChoice } = this.state;
        // console.log(listChoice);
        this.whetherIsRight();
        // setTimeout(() => { this.whetherIsRight(); }, 0);
    }

    /**
     * 字符串排序方法
     * @param {string} str 输入的字符串
     */
    stringSort = (str) => {
        return (
            str.split('').sort().join('')
        );
    }

    /**
     * 判断是否答对,同时将选项卡隐藏，答案提示框出现，设置是否答对状态(0=>right,1=>false)
     */
    whetherIsRight = () => {
        const { listChoice } = this.state;
        let { choiceState, answerHintsState, whetherIsRight } = this.state;
        if (listChoice === rightOptions) {
            whetherIsRight = 0;
        } else {
            whetherIsRight = 1;
        }
        choiceState = false;
        answerHintsState = true;
        this.setState(
            {
                whetherIsRight, choiceState, answerHintsState
            }
        );
    }

    /**
     * 倒计时功能，当时间到0的时候，清空时间句柄，如果此时答案框不在，说明没有提交答案，就隐藏选项卡悬浮球弹出答案框
     */
    countDown = () => {
        let { countDownTime, choiceState, floatingWindowState, answerHintsState } = this.state;
        let timer = setTimeout(() => {
            if (countDownTime > 0) {
                countDownTime--;
                this.setState({
                    countDownTime
                });
                // console.log(timer); =>数字45，48，49，50。。。
                return this.countDown();
            }
            timer = null;
            // console.log(timer);
            if (!answerHintsState) {
                choiceState = false;
                floatingWindowState = false;
                answerHintsState = true;
                this.setState({
                    choiceState,
                    floatingWindowState,
                    answerHintsState
                });
            }
        }, 1000);
    }

    /**
     * 点击x时候，关闭选项卡出现悬浮球
     */
    closeClick = () => {
        let { choiceState, floatingWindowState } = this.state;
        choiceState = false;
        floatingWindowState = true;
        this.setState({
            choiceState,
            floatingWindowState
        });
    }

    /**
     * 点击悬浮球，出现选项卡关闭悬浮球
     */
    openAnswer = () => {
        let { choiceState, floatingWindowState } = this.state;
        choiceState = !choiceState;
        floatingWindowState = !floatingWindowState;
        this.setState({
            choiceState,
            floatingWindowState
        });
    }

    render() {
        const {
            list, optionsAcount, answerHintsState, floatingWindowState, choiceState, countDownTime, whetherIsRight, listChoice
        } = this.state;
        const headerNotice = (type === 'one' ? '单选' : '多选');
        return (
            <div>
                {
                    choiceState
                        ?
                        <div className="checkout-box-in-class">
                            <header className="checkout-box-header">
                                {headerNotice}
                                <img
                                    src="https://imgs.genshuixue.com/0cms/d/file/content/2019/01/5c407069b9c3b.png"
                                    alt="close"
                                    onClick={this.closeClick}
                                />
                            </header>
                            <main className={`checkout-box-main ${optionsAcount ? '' : 'checkout-box-options-short'}`}>
                                {list.map(val => (
                                    <section
                                        className={`checkout-box-options ${val.active ? 'checkout-box-options-active' : ''}`}
                                        onClick={this.handleClick(val.index)}
                                        key={val.index}
                                    >
                                        {val.name}
                                    </section>
                                ))}
                            </main>
                            <footer className="checkout-box-footer">
                                <section className="checkout-box-notice">请在{countDownTime}s内完成答题</section>
                                <button
                                    className="checkout-box-btn"
                                    onClick={this.submitAnswer}
                                    disabled={!listChoice.length}
                                >提 交</button>
                            </footer>
                        </div>
                        :
                        ''
                }
                {answerHintsState ? <AnswerHints
                    whetherIsRight={whetherIsRight}
                    correctAnswer={rightOptions}
                ></AnswerHints> : ''}
                {floatingWindowState ? <FloatingWindow
                    countDownTime={countDownTime}
                    onClick={this.openAnswer}
                ></FloatingWindow> : ''}
            </div>
        );
    }

}