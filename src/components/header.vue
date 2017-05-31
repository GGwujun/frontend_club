<template lang="html">
  <header id="header">
    <a id="logo">
      <img src="../assets/images/ionic.png" alt=""  style="max-height:60%;"/>
    </a>
    <el-menu id="navbar" theme="dark" :default-active="curPage" class="el-menu-demo" mode="horizontal" router>
      <el-menu-item index="index" :route="{name: 'index', query: {tab: 'all'}}">首页</el-menu-item>
      <!--<el-menu-item index="api" :route="{name: 'api'}">API</el-menu-item>-->
      <!--<el-menu-item index="about" :route="{name: 'about'}">关于</el-menu-item>-->
      <el-menu-item index="login" :route="{name: 'login'}" v-if="!user.loginname">登录</el-menu-item>
      <el-menu-item index="regest" :route="{name: 'regest'}" v-if="!user.loginname">注册</el-menu-item>
      <el-submenu index="user" v-if="user.loginname">
        <template slot="title"><img :src="user.avatar" alt="" class="avatar"/>{{user.loginname}}<el-badge :value="user.message" :max="99" class="mark" v-if="user.message > 0"></el-badge></template>
        <!--<el-menu-item index="personal" :route="{name: 'user', params: {name: user.loginname}}">个人主页</el-menu-item>-->
        <!--<el-menu-item index=""><span>积分：</span>{{user.score}}</el-menu-item>-->
        <!--<el-menu-item index="message" :route="{name: 'message'}"><i class='el-icon-message'></i>消息<el-badge :value="user.message" :max="99" class="mark"></el-badge></el-menu-item>-->
        <el-menu-item index="" @click.native="logout"><i class="el-icon-upload2"></i>退出</el-menu-item>
      </el-submenu>
      <el-menu-item index="newtopic" @click="goAdmin()" v-if="user.loginname">登陆后台发布话题</el-menu-item>
      <el-menu-item index="other" v-show="false"></el-menu-item>
  </el-menu>
  </header>
</template>

<script>
import {
    mapGetters
} from "vuex";

export default {
    data() {
        return {
            curPage: "" //当前header所在栏目
        }
    },
    computed: mapGetters({
        user: 'getUserInfo'
    }),
    watch: {
        "$route"(to, from) {
            let map = ["index", "api", "about", "login", "personal", "message", "newtopic"];
            this.curPage = map.indexOf(this.$route.name) < 0 ? "other" : this.$route.name; //如果router变化，将curPage转到该router
            if (this.$route.params.name === this.user.loginid) {
                this.curPage = "personal";
            }
            if (this.user.loginid) {
                this.fetchMessage();
                this.fetchUserInfo();
            }
        },
        "user"() {
            if (this.user.loginid) {
                this.fetchMessage();
                this.fetchUserInfo();
            }
        }
    },
    methods: {
        goAdmin(){
            window.location.href="www.baidu.com";
        },
        //获取用户信息 just for 获取用户积分
        fetchUserInfo() {
            let self = this;
            $.ajax({
                url: "http://119.23.245.101:8080/User/GetUser",
                type: "GET",
                data: {
                    loginid: self.user.loginid
                }
            }).done((res) => {
                if (!res || !res.success) {
                    //TODO 是否错误抛出  有待商榷
                    return;
                }
                localStorage.score = res.data.score;
                this.$store.commit("setValue", {
                    key: "score",
                    value: res.data.score
                });
            }).fail((error) => {
                //TODO 是否错误抛出  有待商榷
            });
        },
        //just for获取未读消息
        fetchMessage() {
            let self = this;
            // $.ajax({
            //     url: "https://cnodejs.org/api/v1/message/count/",
            //     type: "GET",
            //     data: {
            //         accesstoken: self.user.accesstoken
            //     }
            // }).done((res) => {
            //     if (!res || !res.success) {
            //         //TODO 是否错误抛出  有待商榷
            //         return;
            //     }
            //     localStorage.message = res.data;
            //     this.$store.commit("setValue", {
            //         key: "message",
            //         value: res.data
            //     })
            // }).fail((error) => {
            //     //TODO 是否错误抛出  有待商榷
            // });
        },
        //退出
        logout() {
            let self = this;
            //先移除locastorage里的用户信息
            Object.keys(self.user).forEach(v => {
                localStorage.removeItem(v);
            });
            self.$store.dispatch("clearUserInfo").then(() => {
                this.$message({
                    showClose: true,
                    message: "退出成功",
                    type: "success",
                    onClose() {
                        if (self.$route.matched.some(record => record.meta.requiresAuth)) {
                            //如果此时路由有登录权限控制，则退出后返回到首页
                            self.$router.push({
                                name: "index",
                                query: {
                                    tab: "all"
                                }
                            });
                        }
                    }
                });
            });
        }
    }
}
</script>

<style lang="css">
#header #logo {
    width: 120px;
    padding: 0 55px;
    height: 60px;
    display: block;
    float: left;
    position: relative;
    z-index: 666;
}

#header #logo img {
    max-width: 100%;
    max-height: 100%;
    display: block;
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}

#header #navbar .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 10px;
}

#header #navbar .mark {
    margin-top: 8px;
    line-height: 1;
    float: right;
}
</style>
