<template lang="html">
  <div id="container">
  <main id="main" v-if="!topicerror">
      <el-row :gutter="20">
        <el-col :span="18">
            <el-row>
                <el-col :span="24" id="topic">
                    <div class="grid-content bg-purple">
                        <el-card class="box-card" id="topic-detail">
                            <div slot="header" class="clearfix">
                                <div class="topic-title">
                                    <el-tag v-if="topic.typeClass" :type="topic.typeClass" :hit="false" :class="topic.typeClass">{{ topic.top | getArticleType(topic.good, topic.tabs) }}</el-tag>
                                    <h1 v-text="topic.title" class="title"></h1>
                                </div>
                                <p class="topic-info">
                                    <span>发布于 {{topic.create_time | getDateFromNow}}</span>
                                    <span v-if="topic">作者 {{topic.loginname}}</span>
                                    <span>{{topic.visit_count}} 次浏览</span>
                                    <span v-if="topic.replies">{{topic.replies.length}} 评论</span>
                                    <span>来自 {{ "" | getArticleType(topic.good, topic.tabs) }}</span>
                                    <!--<el-button class="editBtn actionBtn" type="text" @click.native="topicEdit" v-if="user.loginname && user.loginname == topic.loginname">
                                        <i class="el-icon-edit"></i>编辑
                                    </el-button>-->
                                    <el-button class="collectBtn actionBtn" type="text" @click.native="topicCollect" v-if="user.loginname">
                                        <i :class="collectBtn[collectBtn.type]"></i>
                                        {{ topic.is_collect && '已' || ''}}收藏
                                    </el-button>
                                </p>
                            </div>
                            <transition name="transition">
                            <main v-if="topic.content" class="markdown-body topic-content" v-html="topic.content">
                            </main>
                            </transition>
                        </el-card>
                    </div>
                </el-col>
            </el-row>
            <cvComment :topic="topic" :comment-list="topic.replies" :comment-count="topic.reply_count"></cvComment>
           <!--<el-row  id="reply-panel" class="cv-panel">
                <el-col :span="24" id="reply-detail">
                    <div class="grid-content bg-purple">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>回复评论</span>
                            </div>
                            <main class="markdown-body reply-content">
                                <cvReply :topic.sync="topic"></cvReply>
                            </main>
                        </el-card>
                    </div>
                </el-col>
            </el-row>-->
        </el-col>
        <el-col :span="6">
            <div class="grid-content bg-purple">
                <cvAside  :authorId="topic.uid" :topicId="topic.id"  :hasRecent="true">
                </cvAside>
            </div>
        </el-col>
    </el-row>
  </main>
  </div>
</template>

<script>
import cvHead from "../components/header.vue";
import cvAside from "../components/aside.vue";
import cvComment from "../components/comment.vue";
import cvReply from "../components/reply.vue";
//import ZoomService from "../assets/plugins/zoom/zoom.js";
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            topic: {
                id: this.$route.params.id,
                author: {
                    loginname: ""
                }
            },
            collectBtn: {
                type: "off",
                on: "el-icon-star-on",
                off: "el-icon-star-off",
                load: "el-icon-loading",
                lock: false, //防止用户多次点击
                switch(load) {
                    this.type = load || "on";
                }
            },
            topicerror: false
        }
    },
    computed: mapGetters({
        user: "getUserInfo"
    }),
    created() {
        this.fetchTopicData();
    },
    beforeUpdate() {
        $("#topic-detail").css({
            overflow: "visible"
        })
        //new ZoomService().listen();
    },
    watch: {
        "$route"(to, from) {
            //如果路由从一个主题进入到另一个主题，此时只改变了hash，因此需要异步加载主题详情
            if (to.name === from.name) {
                this.topic.id = to.params.id;
                this.collectBtn.type = "off";
                this.fetchTopicData();
            }
        }
    },
    methods: {
        //获取主题详情
        fetchTopicData() {
            let self = this;
            self.setLoading(true);
            $.ajax({
                url: "http://119.23.245.101:8080/Topics/findArticle",
                type: "GET",
                dataType: "json",
                data: {
                    mdrender: true,
                    id: this.topic.id,
                    accesstoken: self.user.accesstoken
                }
            }).done((res) => {
                self.setLoading(false);
                if (!res || !res.success) {
                    //TODO 是否错误抛出  有待商榷
                    return;
                }
                self.topic = res.data || self.topic;
                self.topic.typeClass = this.getTypeClass(self.topic.top, self.topic.good, self.topic.tabs)
                if (self.topic.is_collect) {
                    self.collectBtn.type = "on";
                }
            }).fail((error) => {
                //TODO 是否错误抛出  有待商榷
                self.setLoading(false);
                self.topicerror = true;
                self.$message({
                    showClose: true,
                    message: JSON.parse(error.responseText).error_msg || "获取数据失败",
                    type: "warning"
                });
            });
        },
        //收藏主题
        topicCollect() {
            // if (this.collectBtn.lock) {
            //     return;
            // }
            // let self = this,
            //     url = "https://cnodejs.org/api/v1/topic_collect/collect",
            //     isCollected = self.collectBtn.type === "on";
            // self.collectBtn.switch("load");
            // self.collectBtn.lock = true;
            // //取消收藏的url
            // if (isCollected) {
            //     url = "https://cnodejs.org/api/v1/topic_collect/de_collect";
            // }
            // $.ajax({
            //     url: url,
            //     type: "POST",
            //     dataType: "json",
            //     data: {
            //         topic_id: self.topic.id,
            //         accesstoken: self.user.accesstoken
            //     }
            // }).done((res) => {
            //     if (!res || !res.success) {
            //         //TODO 是否错误抛出  有待商榷
            //         self.$message({
            //             showClose: true,
            //             message: "操作失败",
            //             type: "warning"
            //         });
            //         return;
            //     }
            //     self.$message({
            //         showClose: true,
            //         message: (isCollected && "取消" || "") + "收藏成功",
            //         type: "success"
            //     });
            //     self.collectBtn.switch(isCollected && "off" || "on");
            //     self.topic.is_collect = !isCollected;
            //     self.collectBtn.lock = false;
            // }).fail((error) => {
            //     //TODO 是否错误抛出  有待商榷
            //     self.error = true;
            //     self.$message({
            //         showClose: true,
            //         message: "操作失败",
            //         type: "warning"
            //     });
            // });
            self.$message({
                showClose: true,
                message: "正在开发中",
                type: "warning"
            });
        },
        //编辑主题
        // topicEdit() {
        //     if (!this.user.accesstoken) {
        //         this.$router.push({ name: "login", query: { redirect: encodeURIComponent(this.$route.path) } });
        //     } else {
        //         let editTopic = {
        //             tab: this.topic.tab,
        //             title: this.topic.title,
        //             content: ""
        //         };
        //         sessionStorage.editTopic = JSON.stringify(editTopic);
        //         this.$router.push({ name: "edittopic", params: { id: this.topic.id } });
        //     }
        // },
        getTypeClass(top, good, tab) {
            if (top) {
                return "success";
            } else if (good) {
                return "danger";
            } else if (tab == "html") {
                return "primary";
            } else if (tab == "html2") {
                return "warning";
            } else if (tab == "html3") {
                return "gray";
            } else if (!top && !good && !tab || (this.$route.query.tab === tab)) {
                return "hidden";
            } else {
                return "";
            }
        },
        setLoading(state) {
            this.$store.commit("setLoading", state);
        }
    },
    components: {
        cvAside,
        cvComment,
        cvReply
    }
}


</script>

<style lang="css">
#container #topic .title {
    font-size: 18px;
    display: inline;
}

#container .topic-info {
    margin-top: 10px;
    position: relative;
}

#container .topic-info span {
    font-size: 12px;
    margin-left: 10px;
    display: inline-block;
    color: #838383;
}

#container .topic-info span:before {
    content: "•";
    margin-right: 5px;
}

#container .actionBtn {
    color: #20a0ff;
    position: absolute;
    bottom: -12px;
    right: 0;
}

#container .actionBtn .editBtn {
    right: 70px;
}

#container .topic-content img {
    cursor: -webkit-zoom-in;
    max-width: 100%!important;
}
</style>
