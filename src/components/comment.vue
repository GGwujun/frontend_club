<template lang="html">
    <el-row id="comment-panel" class="cv-panel">
        <el-col :span="24">
            <div class="grid-content bg-purple">
                <el-card class="box-card" id="comment-detail">
                    <div slot="header" class="clearfix">
                        <span v-if="commentCount">{{commentCount}} 条评论</span>
                        <span v-else>暂无评论</span>
                    </div>
                    <transition-group tag="main" class="markdown-body commentarea" name="transition">
                    <!-- <main class="markdown-body comment-area"> -->
                        <article class="comment" v-for="(item, index) in commentList" :key="item.id">
                            <router-link :to="{name:'user', params: {name: item.author.loginname}}" class="comment-avatar">
                              <img :src="item.author.avatar_url" alt="" class="img"/>
                            </router-link>
                            <section class="comment-list">
                                <header class="comment-title">
                                    <span class="name" v-text="item.author.loginname"></span>
                                    <span class="floor">{{ index + 1 }}楼</span>
                                    <span class="time">发布于 {{ item.create_at | getDateFromNow }}</span>
                                    <el-button-group class="comment-action">
                                        <el-button type="text"
                                            :plain="true"
                                            v-if="item.upBtn"
                                            :icon="item.upBtn[item.upBtn.type]"
                                            class="comment-up nopadding"
                                            @click.native="commentUp(item)"
                                            :disabled="item.author.loginname === user.loginname">{{ item.ups.length }}</el-button>
                                        <el-button :plain="true"
                                            type="text"
                                            icon="edit"
                                            @click.native="addReply(item.id)"
                                            :show="currentReplyId"
                                            class="comment-reply nopadding"></el-button>
                                    </el-button-group>
                                </header>
                                <main class="comment-content">
                                    <p class="content" v-html="item.content">
                                    </p>
                                </main>
                                <cvReply :topic.sync="topic"
                                    :reply-id="item.id"
                                    :reply-to="item.author.loginname"
                                    @hideReplyPanel="hideReplyPanel"
                                    v-if="currentReplyId === item.id"></cvReply>
                            </section>
                        </article>
                    <!-- </main> -->
                </transition-group>
                </el-card>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import cvReply from "./reply.vue";
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            currentReplyId: "",
        }
    },
    props: ["topic", "commentList", "commentCount"],
    computed: mapGetters({
        user: "getUserInfo"
    }),
    watch: {
        "commentList"() {
            let self = this;
            this.commentList.forEach(function (v, i) {
                self.$set(v, "isUp", self.checkIsUp(v.ups))
                self.$set(v, "upBtn", {
                    type: v.isUp && "on" || "off",
                    on: "star-on",
                    off: "star-off",
                    load: "loading",
                    lock: false, //防止用户多次点击
                    switch(load) {
                        this.type = load || "on";
                    }
                })
            });
        }
    },
    methods: {
        //跳转到登陆界面
        goLogin() {
            this.$router.replace({ name: "login", query: { redirect: encodeURIComponent(this.$route.path) } });
        },
        //顶评论
        commentUp(comment) {
            if (!this.user.loginname) {
                this.goLogin();
            } else {
                if (comment.author.loginname === this.user.loginname) {
                    this.$message({
                        showClose: true,
                        message: "不能给自己点赞",
                        type: "warning"
                    });
                    return;
                }
                let upType = comment.upBtn.type;
                comment.upBtn.switch("load");
                let self = this;
                $.ajax({
                    url: "https://cnodejs.org/api/v1/reply/" + comment.id + "/ups",
                    type: "POST",
                    dataType: "json",
                    data: {
                        accesstoken: self.user.accesstoken
                    }
                }).done((res) => {
                    if (!res || !res.success) {
                        //TODO 是否错误抛出  有待商榷
                        self.$message({
                            showClose: true,
                            message: "操作失败",
                            type: "warning"
                        });
                        return;
                    }
                    if (res.action == "up") {
                        comment.upBtn.type = "on";
                        comment.ups.push(self.user.id);
                    } else if (res.action == "down") {
                        comment.upBtn.type = "off";
                        comment.ups.splice(comment.ups.indexOf(self.user.id), 1);
                    }
                }).fail((res) => {
                    comment.upBtn.type = upType;
                    //TODO 是否错误抛出  有待商榷
                    self.$message({
                        showClose: true,
                        message: "操作失败",
                        type: "warning"
                    });
                });
            }
        },
        //给评论回复评论
        addReply(commentId) {
            if (!this.user.loginname) {
                this.goLogin();
            } else {
                this.currentReplyId = (this.currentReplyId === commentId) ? "" : commentId;
            }
        },
        //隐藏每个评论的reply区域
        hideReplyPanel() {
            this.currentReplyId && (this.currentReplyId = "");
        },
        //检查评论是否被赞过
        checkIsUp(ups) {
            let result = "",
                self = this;
            result = ups.find((v) => {
                if (v === self.user.id) {
                    return true;
                }
            });
            return result && true || false;
        }
    },
    components: {
        cvReply
    }
}
</script>

<style lang="css">
.comment {
    transition: all 1s;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    flex-flow: row nowrap;
    border-top: 1px solid rgba(160, 160, 160, 0.2);
    padding: 10px 0;
}

.comment:first-of-type {
    border-top: none;
}

.comment.comment-avatar {
    flex: 1 0 30px;
}

.comment.comment-avatar img {
    max-width: 100%;
    border-radius: 3px;
}

.comment-list {
    margin-left: 20px;
    width: 100%;
    overflow: auto;
}

.comment-list .name {
    color: #666;
    font-size: 12px;
}

.comment-list .time,
.comment-list .floor {
    margin-left: 10px;
    color: #08c;
    font-size: 11px;
}

.comment-list .comment-action {
    float: right;
}

.comment-list .comment-content {
    margin-top: 5px;
}

.comment-list .comment-action .comment-reply {
    margin-left: 10px;
}
</style>
