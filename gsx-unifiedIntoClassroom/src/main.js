/* eslint-disable brace-style */
/* eslint-disable max-len */
/* eslint-disable arrow-parens */
/* eslint-disable operator-linebreak */
import http from './http';
import {parseCookie} from './util/cookie';

/**
 *  32是类直播，2是直播（目前只需要关注这两个）
 */
const LESSON_WAY = {
    DISCUSS: 1,
    ONLINE: 2,
    STUDENT: 4,
    TEACHER: 8,
    OTHER: 16,
    VIDEO: 32,
};

// 进入直播教室小流量
const whiteList = (params) => http.get('/sapi/auth/whiteList', {params});
// 进入直播教室
const getButtonUrlPosts = (params) => http.get('/sapi/video/playV2', {params});
// 进入直播教室新接口
const newButtonUrlPosts = (params) =>
    http.get('/v1/sapiPlayLogicAPI/playV2', {params});

/**
 * 直播进教室
 */
const unifiedIntoClassroom = async ({params, haboReport, setStateFn}) => {
    const {
        courseType,
        lessonWay,
        cellClazzLessonNumber,
        courseNumber,
        history,
        openModel,
    } = params;

    // 2--类直播（视频） 1--直播
    const type = lessonWay === LESSON_WAY.VIDEO ? 2 : 1;

    // 大致逻辑是四种场景，在助手端播放的 直播和视频；在pc页面播放的 直播和视频，
    // 只有免费课可以在pc播放，如公开课，免费课；专题课和系列课等付费课必须跳转助手或者提示去助手上课

    // ----------------------------------------------------------------

    // 网页
    if (!~navigator.userAgent.indexOf('WenZaiZhiBoClient')) {
        setStateFn && setStateFn({loading: true});

        getButtonUrlPosts(params)
            .then(({data}) => {
                const {playList, pcNativePlay, liveInfo} = data.url;
                // 视频
                if (lessonWay === LESSON_WAY.VIDEO) {
                    // 需要在直播助手播放 （如系列课，专题课）
                    if (pcNativePlay) {
                        let activeUrl;
                        // 此处获取播放链接可以用直播助手逻辑
                        playList.forEach(({schedules}) => {
                            schedules.forEach(({active, pcUrl}) => {
                                // 1 是默认播放项
                                if (active) {
                                    activeUrl = pcUrl;
                                }
                            });
                        });

                        openModel &&
                            openModel.infoFn(
                                courseType,
                                cellClazzLessonNumber,
                                activeUrl
                            );
                        return;
                    }

                    // 可以在pc播放（如公开课，免费课）
                    // ps：需要确认是否可以用新的视频播放页
                    location.href = `/pcweb/#/videonew/${cellClazzLessonNumber}/${courseType}/${type}`;
                    return;
                }

                // 直播
                const isPublic = !!(liveInfo && liveInfo.isPublic);

                // 需要直播助手 或者 非免费课
                if (pcNativePlay || !isPublic) {
                    openModel.infoFn(courseType, cellClazzLessonNumber);
                } else {
                    // pc端看直播
                    const {AUTH_TOKEN} = parseCookie(document.cookie);
                    const jumpLink = `${data.url.pc}&auth_token=${AUTH_TOKEN}`;
                    location.href = jumpLink;
                }
            })
            .finally(this.setState({loading: false}));
        return;
    }

    // ----------------------------------------------------------------

    // 直播助手
    // 直播助手中此处只在我的课表中会出现
    if (~navigator.userAgent.indexOf('WenZaiZhiBoClient')) {
        // 有上报则执行上报
        haboReport &&
            haboReport({
                type: 1,
                step: 0,
                time: +new Date(),
            });

        // 直播
        if (type === 1) {
            let urlResponse;

            try {
                setStateFn && setStateFn({loading: true});

                const res = await whiteList({
                    type: 2,
                    resource: 'haoke_living_lesson_enter_room',
                });

                if (res.data.isWhiteList) {
                    urlResponse = await newButtonUrlPosts(params);
                } else {
                    urlResponse = await getButtonUrlPosts(params);
                }
            } catch {
                try {
                    urlResponse = await newButtonUrlPosts(params);
                } catch {
                    urlResponse = await getButtonUrlPosts(params);
                }
            } finally {
                setStateFn && setStateFn({loading: false});
            }

            if (!urlResponse) {
                return;
            }

            const {AUTH_TOKEN} = parseCookie(document.cookie);
            const jumpLink = `${urlResponse.data.url.pc}&auth_token=${AUTH_TOKEN}`;

            window.location.href = jumpLink;
        }
        // 视频
        else {
            history.push(
                `/live/videoPlay?cellClazzLessonNumber=${cellClazzLessonNumber}&courseType=${courseType}&type=${type}&courseNumber=${courseNumber}`
            );
        }
    }
};

export default unifiedIntoClassroom;
