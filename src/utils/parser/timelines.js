import {
  formatTimestamp,
  replaceLineBreaksWithSpace,
  cleanTextForExcel,
} from "./common.js";
import { collectAction, progressAction } from "../../type.js";

// 什么神人代码:D
function generateProgressItem(timeline, format, type, username, createdTime) {
  let epsTotal;
  let epsUpdate;
  let volsTotal;
  let volsUpdate;
  let subject;
  let subjectType;
  if (timeline.memo.progress.single) {
    epsUpdate = timeline.memo.progress.single.episode.sort;
    subject = timeline.memo.progress.single.subject;
    subjectType = subject.type;
    switch (format) {
      case "json":
        return timeline;
      case "txt":
        let txtTimeline = "";
        txtTimeline = `[${createdTime}] - [进度更新] ${progressAction[subjectType][type]}「${subject.name}」`;
        if (epsUpdate !== 0) {
          txtTimeline = txtTimeline + `第 ${epsUpdate} 话`;
        }
        return txtTimeline;
      case "excel":
        let excelTimeline = "";
        excelTimeline = `${createdTime},进度更新,${progressAction[subjectType][type]}「${subject.name}」`;
        if (epsUpdate !== 0) {
          excelTimeline = excelTimeline + `第 ${epsUpdate} 话`;
        }
        return excelTimeline;
      case "pdf":
        let status = "";
        status = `${progressAction[subjectType][type]}「${subject.name}」`;
        if (epsUpdate !== 0) {
          status = status + `第 ${epsUpdate} 话`;
        }
        let timelineItem = {};
        timelineItem.id = timeline.id;
        timelineItem.type = "进度更新";
        timelineItem.username = username;
        timelineItem.status = status;
        timelineItem.subject = subject;
        timelineItem.createdTime = createdTime;
        return timelineItem;
      default:
        return timeline;
    }
  }
  epsTotal = timeline.memo.progress.batch.epsTotal;
  epsUpdate = timeline.memo.progress.batch.epsUpdate;
  volsTotal = timeline.memo.progress.batch.volsTotal;
  volsUpdate = timeline.memo.progress.batch.volsUpdate;
  subject = timeline.memo.progress.batch.subject;
  subjectType = subject.type;
  switch (format) {
    case "json":
      return timeline;
    case "txt":
      let txtTimeline = "";
      txtTimeline = `[${createdTime}] - [进度更新] ${progressAction[subjectType][type]}「${subject.name}」`;
      if (epsUpdate !== 0) {
        txtTimeline = txtTimeline + `第 ${epsUpdate} of ${epsTotal} 话`;
      }
      if (volsUpdate !== 0) {
        txtTimeline = txtTimeline + `第 ${volsUpdate} of ${volsTotal} 卷`;
      }
      return txtTimeline;
    case "excel":
      let excelTimeline = "";
      excelTimeline = `${createdTime},进度更新,${progressAction[subjectType][type]}「${subject.name}」`;
      if (epsUpdate !== 0) {
        excelTimeline = excelTimeline + `第 ${epsUpdate} of ${epsTotal} 话`;
      }
      if (volsUpdate !== 0) {
        excelTimeline = excelTimeline + `第 ${volsUpdate} of ${volsTotal} 卷`;
      }
      return excelTimeline;
    case "pdf":
      let status = "";
      status = `${progressAction[subjectType][type]}「${subject.name}」`;
      if (epsUpdate !== 0) {
        status = status + `第 ${epsUpdate} of ${epsTotal} 话`;
      }
      if (volsUpdate !== 0) {
        status = status + `第 ${volsUpdate} of ${volsTotal} 卷`;
      }
      let timelineItem = {};
      timelineItem.id = timeline.id;
      timelineItem.type = "进度更新";
      timelineItem.username = username;
      timelineItem.status = status;
      timelineItem.subject = subject;
      timelineItem.createdTime = createdTime;
      return timelineItem;
    default:
      return timeline;
  }
}

// 我好像是天才来的w
function generateCollectionItem(timeline, format, type, username, createdTime) {
  let subject = timeline.memo.subject;
  // 处理同时收藏多条目
  // 只返回状态信息
  // TODO 处理多条目其他信息
  if (subject.length > 1) {
    let subjectNames = "";
    subject.forEach((s, index) => {
      if (index > 0) subjectNames = subjectNames + "、";
      subjectNames = subjectNames + "「" + s.subject.name + "」";
    });
    let numberInfo = "";
    if (type === 13 || type === 14) {
      numberInfo = "";
    } else {
      numberInfo = `${subject.length}${collectAction[type][1]}`;
    }
    switch (format) {
      case "json":
        return timeline;
      case "txt":
        let txtTimeline = "";
        txtTimeline = `[${createdTime}] - [收藏] ${collectAction[type][0]}${subjectNames}${numberInfo}`;
        // if(comment) {
        //   txtTimeline = txtTimeline + ' / ' + comment;
        // }
        return txtTimeline;
      case "excel":
        let excelTimeline = "";
        excelTimeline = `${createdTime},收藏,${collectAction[type][0]}${subjectNames}${numberInfo}`;
        // if(comment) {
        //   excelTimeline = excelTimeline + ',' + comment;
        // }
        return excelTimeline;
      case "pdf":
        let status = "";
        status = `${collectAction[type][0]}${subjectNames}${numberInfo}`;
        let timelineItem = {};
        timelineItem.id = timeline.id;
        timelineItem.type = "收藏";
        timelineItem.username = username;
        timelineItem.status = status;
        // timelineItem.subject = subject;
        // timelineItem.comment = comment;
        timelineItem.createdTime = createdTime;
        return timelineItem;
      default:
        return timeline;
    }
  }
  subject = subject[0];
  const comment = subject.comment;
  switch (format) {
    case "json":
      return timeline;
    case "txt":
      let txtTimeline = "";
      txtTimeline = `[${createdTime}] - [收藏] ${collectAction[type][0]}「${subject.subject.name}」`;
      if (comment) {
        txtTimeline = txtTimeline + " / " + cleanTextForExcel(comment);
      }
      return txtTimeline;
    case "excel":
      let excelTimeline = "";
      excelTimeline = `${createdTime},收藏,${collectAction[type][0]}「${subject.subject.name}」`;
      if (comment) {
        excelTimeline = excelTimeline + "," + cleanTextForExcel(comment);
      }
      return excelTimeline;
    case "pdf":
      let status = "";
      status = `${collectAction[type][0]}「${subject.subject.name}」`;
      let timelineItem = {};
      timelineItem.id = timeline.id;
      timelineItem.type = "收藏";
      timelineItem.username = username;
      timelineItem.status = status;
      timelineItem.subject = subject.subject;
      timelineItem.comment = cleanTextForExcel(comment);
      timelineItem.createdTime = createdTime;
      return timelineItem;
    default:
      return timeline;
  }
}

// 处理 cat 8 type 1
function generatePersonItem(timeline, format, type, username, createdTime) {
  let monoCharcter = timeline.memo.mono.characters || [];
  let monoPerson = timeline.memo.mono.persons || [];
  // cp = Charcter + Person
  let cp = new Array(monoCharcter.length + monoPerson.length);
  for (let i = 0; i < monoCharcter.length; i++) {
    cp[i] = monoCharcter[i];
  }
  for (let i = 0; i < monoPerson.length; i++) {
    cp[monoCharcter.length + i] = monoPerson[i];
  }
  // 处理同时收藏多条目
  // 只返回状态信息
  // TODO 处理多条目其他信息
  if (cp.length > 1) {
    let cpNames = "";
    cp.forEach((c, index) => {
      if (index > 0) cpNames = cpNames + "、";
      cpNames = cpNames + "「" + c.name + "」";
    });
    let numberInfo = cp.length + "个人物";
    switch (format) {
      case "json":
        return timeline;
      case "txt":
        let txtTimeline = "";
        txtTimeline = `[${createdTime}] - [人物收藏] 收藏了${cpNames}${numberInfo}`;
        // if(comment) {
        //   txtTimeline = txtTimeline + ' / ' + comment;
        // }
        return txtTimeline;
      case "excel":
        let excelTimeline = "";
        excelTimeline = `${createdTime},人物收藏,收藏了${cpNames}${numberInfo}`;
        // if(comment) {
        //   excelTimeline = excelTimeline + ',' + comment;
        // }
        return excelTimeline;
      case "pdf":
        let status = "";
        status = `收藏了${cpNames}${numberInfo}`;
        let timelineItem = {};
        timelineItem.id = timeline.id;
        timelineItem.type = "人物收藏";
        timelineItem.username = username;
        timelineItem.status = status;
        // timelineItem.social = cp;
        timelineItem.createdTime = createdTime;
        return timelineItem;
      default:
        return timeline;
    }
  }
  switch (format) {
    case "json":
      return timeline;
    case "txt":
      let txtTimeline = "";
      txtTimeline = `[${createdTime}] - [收藏] 收藏了人物「${cp[0].name}」`;
      // if (comment) {
      //   txtTimeline = txtTimeline + " / " + cleanTextForExcel(comment);
      // }
      return txtTimeline;
    case "excel":
      let excelTimeline = "";
      excelTimeline = `${createdTime},收藏,收藏了人物「${cp[0].name}」`;
      // if (comment) {
      //   excelTimeline = excelTimeline + "," + cleanTextForExcel(comment);
      // }
      return excelTimeline;
    case "pdf":
      let status = "";
      status = `收藏了人物「${cp[0].name}」`;
      let timelineItem = {};
      timelineItem.id = timeline.id;
      timelineItem.type = "收藏";
      timelineItem.username = username;
      timelineItem.status = status;
      timelineItem.social = cp[0];
      const mediumImage = cp[0]?.images?.medium || "https://bgm.tv/img/info_only.png";
      timelineItem.social = {
          ...timelineItem.social,
          images: {
              ...(timelineItem.social?.images || {}),
              medium: mediumImage
          }
      };
      timelineItem.createdTime = createdTime;
      return timelineItem;
    default:
      return timeline;
  }
}

// 处理 cat 7
function generateIndexItem(timeline, format, type, username, createdTime) {
  const action = type == 0 ? "创建" : "收藏";
  const indexCollection = timeline.memo.index;
  switch (format) {
    case "json":
      return timeline;
    case "txt":
      let txtTimeline = "";
      txtTimeline = `[${createdTime}] - [目录] ${action}了目录「${indexCollection.title}」`;
      return txtTimeline;
    case "excel":
      let excelTimeline = "";
      excelTimeline = `${createdTime},目录,${action}了目录「${indexCollection.title}」`;
      return excelTimeline;
    case "pdf":
      let status = "";
      status = `${action}了目录「${indexCollection.title}」`;
      let timelineItem = {};
      timelineItem.id = timeline.id;
      timelineItem.type = "目录";
      timelineItem.username = username;
      timelineItem.status = status;
      timelineItem.createdTime = createdTime;
      return timelineItem;
    default:
      return timeline;
  }
}

// 根据Cat和Type解析单条时间线
// 默认不处理 json 数据
export function parseTimelineByCatAndType(timeline, format, username = "") {
  try {
    const { cat, type } = timeline;
    const createdTime = formatTimestamp(timeline.createdAt);
    switch (cat) {
      case 1: // TimelineCat.Daily - 日常
        switch (type) {
          // TODO 这是什么东西:D
          case 0: // TimelineDailyType.Mystery - 神秘的行动
            // 处理神秘行动逻辑？？？？
            break;
          case 1: // TimelineDailyType.Register - 注册
            // 处理注册逻辑
            switch (format) {
              case "json":
                return timeline;
              case "txt":
                let txtTimeline = "";
                txtTimeline = `[${createdTime}] - [日常] 注册成为了 Bangumi 成员`;
                return txtTimeline;
              case "excel":
                let excelTimeline = "";
                excelTimeline = `${createdTime},日常,注册成为了 Bangumi 成员`;
                return excelTimeline;
              case "pdf":
                let status = "";
                status = `注册成为了 Bangumi 成员`;
                let timelineItem = {};
                timelineItem.id = timeline.id;
                timelineItem.type = "日常";
                timelineItem.username = username;
                timelineItem.status = status;
                timelineItem.createdTime = createdTime;
                return timelineItem;
              default:
                return timeline;
            }
          case 2: // TimelineDailyType.AddFriend - 添加好友
            // 处理添加好友逻辑
            // TODO 处理多位好友信息
            const friends = timeline.memo.daily.users;
            let friendsName = "";
            friends.forEach((f, index) => {
              if(index > 0) friendsName = friendsName + "、";
              friendsName = friendsName + "「" + f.nickname + "」";
            });
            let addFriendsInfo = "";
            if(friends.length > 1) {
              addFriendsInfo = "将 " + friendsName + `${friends.length} 位成员加为了好友`;
            }
            else {
              addFriendsInfo = `将 ${friendsName} 加为了好友`;
            }
            switch (format) {
              case "json":
                return timeline;
              case "txt":
                let txtTimeline = "";
                txtTimeline = `[${createdTime}] - [日常] ${addFriendsInfo} `;
                return txtTimeline;
              case "excel":
                let excelTimeline = "";
                excelTimeline = `${createdTime},日常,${addFriendsInfo}`;
                return excelTimeline;
              case "pdf":
                let status = "";
                status = `${addFriendsInfo}`;
                let timelineItem = {};
                timelineItem.id = timeline.id;
                timelineItem.type = "日常";
                timelineItem.username = username;
                timelineItem.status = status;
                if(friends.length == 1) {
                  timelineItem.social = {
                    "images": {
                      "medium": timeline.memo.daily.users[0].avatar.medium
                    }
                  }
                }
                timelineItem.createdTime = createdTime;
                return timelineItem;
              default:
                return timeline;
            }
          case 3: // TimelineDailyType.JoinGroup - 加入小组
            // 处理加入小组逻辑
            // TODO 处理加入多个小组信息
            const groups = timeline.memo.daily.groups;
            let groupsName = "";
            groups.forEach((f, index) => {
              if(index > 0) groupsName = groupsName + "、";
              groupsName = groupsName + "「" + f.title + "」";
            });
            let addgroupsInfo = "";
            if(groups.length > 1) {
              addgroupsInfo = "加入了" + groupsName + `${groups.length} 个小组`;
            }
            else {
              addgroupsInfo = `加入了${groupsName}小组`;
            }
            switch (format) {
              case "json":
                return timeline;
              case "txt":
                let txtTimeline = "";
                txtTimeline = `[${createdTime}] - [日常] ${addgroupsInfo} `;
                return txtTimeline;
              case "excel":
                let excelTimeline = "";
                excelTimeline = `${createdTime},日常,${addgroupsInfo}`;
                return excelTimeline;
              case "pdf":
                let status = "";
                status = `${addgroupsInfo}`;
                let timelineItem = {};
                timelineItem.id = timeline.id;
                timelineItem.type = "日常";
                timelineItem.username = username;
                timelineItem.status = status;
                if(groups.length == 1) {
                  timelineItem.social = {
                    "images": {
                      "medium": timeline.memo.daily.groups[0].icon.medium || "https://bgm.tv/img/info_only.png"
                    }
                  }
                }
                timelineItem.createdTime = createdTime;
                return timelineItem;
              default:
                return timeline;
            }
          case 4: // TimelineDailyType.CreateGroup - 创建小组
            // 处理创建小组逻辑
            // 时间胶囊 API 没有提供创建小组的小组信息
            switch (format) {
              case "json":
                return timeline;
              case "txt":
                let txtTimeline = "";
                txtTimeline = `[${createdTime}] - [日常] 创建了小组`;
                return txtTimeline;
              case "excel":
                let excelTimeline = "";
                excelTimeline = `${createdTime},日常,创建了小组`;
                return excelTimeline;
              case "pdf":
                let status = "";
                status = `创建了小组`;
                let timelineItem = {};
                timelineItem.id = timeline.id;
                timelineItem.type = "日常";
                timelineItem.username = username;
                timelineItem.status = status;
                timelineItem.createdTime = createdTime;
                return timelineItem;
              default:
                return timeline;
            }
            break;
          // TODO 这又是什么东西
          case 5: // TimelineDailyType.JoinEden - 加入乐园
            // 处理加入乐园逻辑
            // 乐园是什么鬼啊喂:D
            break;
          default:
            // 处理未知的日常类型
            break;
        }
        break;

      case 2: // TimelineCat.Wiki - 维基
        switch (type) {
          case 1: // 添加新书
            // 处理添加新书逻辑
            break;
          case 2: // 添加新动画
            // 处理添加新动画逻辑
            break;
          case 3: // 添加新唱片
            // 处理添加新唱片逻辑
            break;
          case 4: // 添加新游戏
            // 处理添加新游戏逻辑
            break;
          case 5: // 添加新图书系列
            // 处理添加新图书系列逻辑
            break;
          case 6: // 添加新影视
            // 处理添加新影视逻辑
            break;
          default:
            // 处理未知的维基类型
            break;
        }
        break;

      case 3: // TimelineCat.Subject - 收藏
        return generateCollectionItem(
          timeline,
          format,
          type,
          username,
          createdTime,
        );

      case 4: // TimelineCat.Progress - 进度
        return generateProgressItem(
          timeline,
          format,
          type,
          username,
          createdTime,
        );

      case 5: // TimelineCat.Status - 状态
        switch (type) {
          case 0: // TimelineStatusType.Sign - 更新签名
            // 处理更新签名逻辑
            const newSign = timeline.memo.status.sign;
            switch (format) {
              case "json":
                return timeline;
              case "txt":
                let txtTimeline = "";
                txtTimeline = `[${createdTime}] - [状态] 更新了签名: ${newSign}`;
                return txtTimeline;
              case "excel":
                let excelTimeline = "";
                excelTimeline = `${createdTime},状态,${cleanTextForExcel('"' + newSign + '"')}`;
                return excelTimeline;
              case "pdf":
                let timelineItem = {};
                timelineItem.id = timeline.id;
                timelineItem.type = "状态";
                timelineItem.username = username;
                timelineItem.status = `更新了签名: ${newSign}`;
                timelineItem.createdTime = createdTime;
                return timelineItem;
              default:
                return timeline;
            }
          case 1: // TimelineStatusType.Tsukkomi - 吐槽
            // 处理吐槽逻辑
            const tsukkomi = replaceLineBreaksWithSpace(
              timeline.memo.status.tsukkomi,
            );
            switch (format) {
              case "json":
                return timeline;
              case "txt":
                let txtTimeline = "";
                txtTimeline = `[${createdTime}] - [状态] ${tsukkomi}`;
                return txtTimeline;
              case "excel":
                let excelTimeline = "";
                excelTimeline = `${createdTime},状态,${cleanTextForExcel('"' + timeline.memo.status.tsukkomi + '"')}`;
                return excelTimeline;
              case "pdf":
                let timelineItem = {};
                timelineItem.id = timeline.id;
                timelineItem.type = "状态";
                timelineItem.username = username;
                timelineItem.status = timeline.memo.status.tsukkomi;
                timelineItem.createdTime = createdTime;
                return timelineItem;
              default:
                return timeline;
            }
          case 2: // TimelineStatusType.Nickname - 修改昵称
            // 处理修改昵称逻辑
            const beforeNickname = timeline.memo.status.nickname.before;
            const afterNickname = timeline.memo.status.nickname.after;
            switch (format) {
              case "json":
                return timeline;
              case "txt":
                let txtTimeline = "";
                txtTimeline = `[${createdTime}] - [状态] 从 ${beforeNickname} 改名为 ${afterNickname}`;
                return txtTimeline;
              case "excel":
                let excelTimeline = "";
                excelTimeline = `${createdTime},状态,${cleanTextForExcel('"' + "从 " + beforeNickname + " 改名为 " + afterNickname + '"')}`;
                return excelTimeline;
              case "pdf":
                let timelineItem = {};
                timelineItem.id = timeline.id;
                timelineItem.type = "状态";
                timelineItem.username = username;
                timelineItem.status = `从 ${beforeNickname} 改名为 ${afterNickname}`;
                timelineItem.createdTime = createdTime;
                return timelineItem;
              default:
                return timeline;
            }
          default:
            // 处理未知的状态类型
            break;
        }
        break;

      case 6: // TimelineCat.Blog - 日志
        // 处理日志逻辑
        const blog = timeline.memo.blog;
        if(type == 1) {
          switch (format) {
            case "json":
              return timeline;
            case "txt":
              let txtTimeline = "";
              txtTimeline = `[${createdTime}] - [日志] 发表了新日志：${blog.title}`;
              return txtTimeline;
            case "excel":
              let excelTimeline = "";
              excelTimeline = `${createdTime},目录,发表了新日志：${blog.title}`;
              return excelTimeline;
            case "pdf":
              let status = "";
              status = `发表了新日志：${blog.title}`;
              let timelineItem = {};
              timelineItem.id = timeline.id;
              timelineItem.type = "日志";
              timelineItem.username = username;
              timelineItem.status = status;
              // 构建 HTML 元素
              timelineItem.subject = {
                "name": `${blog.title}`,
                "info": `${blog.summary}`,
                "images": {
                  // 处理 API 返回的图片链接 404 问题，绝了:D
                  "medium": `${blog.icon.replace("https://lain.bgm.tv/pic/photo/g/no_photo.png", "https://bgm.tv/img/info_only.png").replace("/pic/photo/g/", "/r/200x200/pic/photo/l/")}`
                }
              };
              timelineItem.createdTime = createdTime;
              return timelineItem;
            default:
              return timeline;
          }
        }
        break;

      case 7: // TimelineCat.Index - 目录
        // 处理目录逻辑
        // 神了，服了:D
        return generateIndexItem(timeline, format, type, username, createdTime);

      case 8: // TimelineCat.Mono - 人物
        // 处理收藏角色/人物逻辑
        // ??? 我那么大一个 cat = 1, 2 呢???
        // 相关链接：https://github.com/bangumi/server-private/blob/5af4a17cc4ef6d4be32c52534ab40054e7c52a1c/lib/timeline/type.ts#L126-L133
        return generatePersonItem(timeline, format, type, username, createdTime);

      // TODO 天窗怎么没看人用过:D
      case 9: // TimelineCat.Doujin - 天窗
        switch (type) {
          case 0: // 添加作品
            // 处理添加同人作品逻辑
            break;
          case 1: // 收藏作品
            // 处理收藏同人作品逻辑
            break;
          case 2: // 创建社团
            // 处理创建同人社团逻辑
            break;
          case 3: // 关注社团
            // 处理关注同人社团逻辑
            break;
          case 4: // 关注活动
            // 处理关注同人活动逻辑
            break;
          case 5: // 参加活动
            // 处理参加同人活动逻辑
            break;
          default:
            // 处理未知的天窗类型
            break;
        }
        break;

      default:
        // 处理未知的cat类型
        console.warn(`未知的时间胶囊类型: ${cat}`);
      return timeline;
    }
  }
  catch(error) {
    console.log(error);
    return timeline;
  }
  return timeline;
}

// TODO 替换 bgm 表情
export function replaceBgmEmotions(text) {
  // TODO 实现替换逻辑
}
