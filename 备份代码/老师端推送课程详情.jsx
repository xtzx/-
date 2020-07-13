/**
 * 老师端推送课程详情
 * @author zhuqitao
 */
import React from 'react';
import PageController from 'common/controller/PageController';
import ajaxService from 'common/util/ajaxService';
import ajaxConfig from 'common/ajaxConfig';

require('css-loader!./index.styl');

// let URL;
class CourseComment extends PageController {
    constructor(props) {
        super(props);
        this.state = {
            stars: [1, 2, 3, 4, 5],     // 星星
            currentStar: -1,            // 当前选中的星星索引
            label: [],                  // 1、2星显示的标签
            activeLabel: [],            // 被选中的标签
            hasComment: false,          // 是否评价成功
            commentState: false,        // 是否已经评价过
            content: '',                // 评价内容
            entityNumber: '',           // 课节number
            contentMaxLen: 200,         // 评价内容最大长度
            contentCurrLen: 0,          // 评价内容当前输入长度
            tooLand: false,             // 评价内容太长
        };
    };

    componentDidMount() {
        // this.initLabel();
        this.getEntityNumber();
        this.getLabel();
    }

    shouldComponentUpdate() {
        return true;
    }

    // 获取课节number
    getEntityNumber = () => {
        const { entityNumber } = this.props.params;
        this.setState({
            entityNumber
        });
        this.getCommitState(entityNumber);
    }

    /**
     * 获取课程是否已经评价过的状态
     * @param {number} entityNumber 课节number
     */
    getCommitState = entityNumber => {
        const params = {
            entityType: 25,
            entityNumber
        };
        ajaxService.get(ajaxConfig.COMMENT.CANBECOMMENT, params).then(res => {
            if (res.code === 0) {
                const { canBeComment } = res.data;
                this.postCommentState(canBeComment);
            }
        });
    }

    // 获取label
    getLabel = () => {
        ajaxService.get(ajaxConfig.COMMENT.LABEL).then(res => {
            const { labels } = res.data;
            const newLabels = labels.map(item => {
                item.active = false;
                return item;
            });
            this.setState({
                label: newLabels
            });
        });
        // this.setState({
        //     label: [
        //         { name: '知识点讲解听不懂', id: 1 },
        //         { name: '课程进度过快', id: 2 },
        //         { name: '重难点不突出', id: 3 },
        //         { name: '语言表达能力差', id: 4 },
        //         { name: '课堂气氛沉闷', id: 5 },
        //         { name: '与学员互动少', id: 6 },
        //         { name: '直播/视频卡顿/延迟', id: 7 },
        //         { name: '画面不清晰', id: 8 },
        //         { name: '音视频不同步', id: 9 },
        //     ]
        // });
    }

    /**
     * 设置tag
     * @param {number} labelID 标签ID
     */
    setTag = labelID => () => {
        const { label } = this.state;
        const newLabel = label.map(item => {
            if (item.id === labelID) {
                const active = item.active;
                item.active = !active;
            }
            return item;
        });
        const activeLabel = newLabel.filter(item => {
            return item.active;
        });
        this.setState({
            label: newLabel,
            activeLabel
        });
    }
    

    /**
     * 设置点亮星星
     * @param {number} index 被点击的星星索引
     */
    setStar = index => () => {
        this.setState({
            currentStar: index
        });
    }

    /**
     * textarea 输入内容
     * @param {Object} e textarea onChange事件对象
     */
    setContent = e => {
        const { value } = e.target;
        const { contentMaxLen } = this.state;
        this.setState({
            content: value,
            contentCurrLen: value.length,
            tooLand: value.length > contentMaxLen
        });
    }
    // 提交评论
    submit = () => {
        const { content, label } = this.state;
        const labelIds = [];
        
        label.forEach(item => {
            if (item.active) {
                labelIds.push(item.id);
            }
        });
        const { entityNumber, currentStar } = this.state;
        const params = {
            entityType: 25,
            entityNumber,
            type: 1,
            score: currentStar + 1,
            labelIds: labelIds.join(','),
            content
        };

        ajaxService.post(ajaxConfig.COMMENT.CREATE, params).then(res => {
            if (res.code === 0) {
                this.setState({
                    hasComment: true
                });
                this.closeView();
            }
        });
        // this.setState({
        //     hasComment: true
        // });
    }
    // 传递是否评论过的状态
    postCommentState = canBeComment => {
        const cmd = canBeComment ? 1 : 2;
        const origin = '*';
        top.postMessage({
            cmd,
            from: 'haoke',
            type: 'evaluateCourse',
            data: {
            }
        }, origin);
    }
    // 关闭iframe
    closeView = () => {
        const origin = '*';
        top.postMessage({
            cmd: 2,
            from: 'haoke',
            type: 'evaluateCourse',
            data: {
            }
        }, origin);
    }

    render() {
        const {
            stars,
            label,
            tooLand,
            content,
            hasComment,
            activeLabel,
            currentStar,
            contentMaxLen,
            contentCurrLen,
        } = this.state;
        return (
            <div className="student-course-comment">
                <div className="head">
                    <div className="text">课节评价</div>
                    {/* eslint-disable */}
                    <img 
                        className="close-icon"
                        src="https://imgs.genshuixue.com/0cms/d/file/content/2019/01/5c32bb7a0df30.png" alt="close"
                        onClick={this.closeView}
                    />
                </div>
                {
                    hasComment
                    ? (
                        <div className="commented">
                            
                            <div className="success">
                                <img src="https://imgs.genshuixue.com/0cms/d/file/content/2019/01/5c32bb7a9cdd0.png" alt="成功" />
                            </div>
                            
                            <div className="info">感谢您的评价</div>

                            <div className="stars-group">
                                {
                                    stars.map((item, index) => (
                                        <div key={item}>
                                            {
                                                index > currentStar
                                                ? (<img src="https://imgs.genshuixue.com/0cms/d/file/content/2019/01/5c32bb7a3d159.png" alt="星星" />)
                                                : (<img src="https://imgs.genshuixue.com/0cms/d/file/content/2019/01/5c32bb7a6c61a.png" alt="星星" />)
                                            }
                                        </div>
                                    ))
                                }
                            </div>

                            {
                                currentStar >= 0 && currentStar <= 1
                                ? (
                                    <div className="tags-group">
                                        <div className="tags">
                                            {
                                                activeLabel.map(item => (
                                                    <div 
                                                        className="tag active"
                                                        key={item.id}
                                                    >
                                                        {item.name}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )
                                : null
                            }

                            <div className="content">{content}</div>
                        </div>
                    )
                    : (
                        <div className="commenting">
                            {
                                currentStar >= 2
                                ? (
                                    <div className="info">
                                        告诉我们您对本次学习体验的总体评论，帮助我们更好地为您提升服务吧！
                                    </div>
                                )
                                : null
                            }
                            

                            <div className="stars-group">
                                {
                                    stars.map((item, index) => (
                                        <div onClick={this.setStar(index)} key={item}>
                                            {
                                                index > currentStar
                                                ? (<img src="https://imgs.genshuixue.com/0cms/d/file/content/2019/01/5c32bb7a3d159.png" alt="星星" />)
                                                : (<img src="https://imgs.genshuixue.com/0cms/d/file/content/2019/01/5c32bb7a6c61a.png" alt="星星" />)
                                            }
                                        </div>
                                    ))
                                }

                            </div>
                            {
                                currentStar >= 0 && currentStar <= 1
                                ? (
                                    <div className="tags-group">
                                        <div className="title">您可能存在以下不满意的地方，告诉我们吧，我们会努力提升的！</div>
                                        <div className="tags">
                                            {
                                                label.map(item => (
                                                    <div 
                                                        className={`tag ${item.active ? 'active' : ''}`}
                                                        onClick={this.setTag(item.id)}
                                                        key={item.id}
                                                    >
                                                        {item.name}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )
                                : null
                            }

                            <div className="content">
                                <textarea
                                    value={content}
                                    onChange={this.setContent}
                                    placeholder="写下你对我们的期待和建议，或者在上课过程中遇到的问题，我们会及时处理，为你带来更好的内容和体验。"
                                >
                                </textarea>
                                <div className="limit">
                                    <span className={`content-currLen ${tooLand ? 'too-lang' : ''}`}>{contentCurrLen}</span>
                                    <span>/{contentMaxLen}</span>
                                </div>
                            </div>

                            <div className="submit">
                                <button 
                                    className={`btn ${tooLand || currentStar < 0 ? 'unable' : ''}`}
                                    disabled={tooLand || currentStar < 0}
                                    onClick={this.submit}
                                >
                                    提交
                                </button>
                            </div>
                        </div>
                    )
                }
                
            </div>
        );
    }
};

export default CourseComment;