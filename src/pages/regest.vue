<template lang="html">
    <div id="container">
    <main id="main">
        <el-row :gutter="20">
            <el-col :span="18" id="content" :offset="3">
                <div class="grid-content bg-purple">
                    <el-card class="box-card">
                        <header slot="header" class="clearfix" id="panel-header">
                            <span>登录</span>
                        </header>
                        <main>
                            <div class="input-area">
                              <el-form ref="form" label-width="80px" @submit.prevent="regest">
                                <el-form-item label="用户名">
                                  <el-input v-model.trim="loginid" :maxlength="36" :minlength='36' placeholder="请输入账号..."></el-input>
                                </el-form-item>
                                <el-form-item label="密码">
                                  <el-input v-model.trim="password" :maxlength="36" :minlength='36' placeholder="请输入密码..."></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click.native="regest">注册</el-button>
                                </el-form-item>
                              </el-form>
                            </div>
                        </main>
                    </el-card>
                </div>
            </el-col>
          </el-row>
    </main>
  </div>
</template>

<script>
export default {
    data() {
        return {
            loginid: "",
            password: '',
            alert: {
                title: "",
                type: "",
                description: "",
            },
            redirect: this.$route.query.redirect || ""
        }
    },
    mounted() { },
    methods: {
        goBack() {
            let redirect = decodeURIComponent(this.$route.query.redirect);
            this.$router.replace(redirect);
        },
        regest() {
            let self = this,
                accesstoken = self.loginid;
            if (!accesstoken) {
                self.$message({
                    showClose: true,
                    message: "请输入账号",
                    type: "error"
                })
                return;
            }
            this.setLoading(true);
            $.ajax({
                type: "POST",
                url: 'http://119.23.245.101:8080/User/regest',
                data: {
                    loginid: self.loginid,
                    password: self.password
                },
                dataType: 'json'
            }).done((res) => {
                this.setLoading(false);
                if (!res || !res.success) {
                    self.errorHandle();
                    return;
                }
                res = res.data;
                let user = {
                    id: res.id,
                    loginname: res.username,
                    avatar: res.avatar_url,
                    accesstoken: res.loginid,
                    score: null,
                    message: null
                };
                //由于vuex在页面刷新时会把state清空（什么鬼呀）
                //所以此处得把user信息存入localStorage
                Object.keys(user).forEach(v => {
                    localStorage[v] = user[v];
                });
                this.$store.dispatch("setUserInfo", user).then(() => {
                    self.$message({
                        showClose: true,
                        message: "注册成功",
                        type: "success",
                        onClose() {
                            let redirect = decodeURIComponent(self.$route.query.redirect || "/");
                            self.$router.replace(redirect);
                        }
                    });
                });
            }).fail((error) => {
                this.setLoading(false);
                self.errorHandle();
            });
        },
        errorHandle() {
            self.$message({
                showClose: true,
                message: "注册出错，请稍候再试！",
                type: "warning"
            });
        },
        setLoading(state) {
            this.$store.commit("setLoading", state);
        }
    }
}
</script>

<style lang="css">
.input-area {
    position: relative;
    text-align: center;
    width: 50%;
    margin-left: 25%;
}
</style>
