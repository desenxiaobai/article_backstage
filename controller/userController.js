const model = require("../model/model.js");
const { editsuccess, editfail, serverbusy, loginfail, usernrepeat, registersuccess, editpwdsuccess, editpwdfail } 
    = require('../config/resmsg.json');
const md5 = require('md5');
const { secret } = require('../config/secret.json');

let controller = {
    login(req, res) {
        if (req.session.userInfo) return res.redirect('/');
        res.render('login');
    },
    async checklogin(req, res) {
        let { username, password } = req.body;
        password = md5(`${password}${secret}`);
        console.log(username,password);
        let sql = `select * from users where username='${username}' and password='${password}'`;
        let data = await model(sql);
        if (data.length) {
            req.session.userInfo = data[0];
            let sql1 = `update users set lastlogindate=now()`;
            await model(sql1);
            res.json(data[0]);
            return;
        }
        res.json(loginfail);
    },
    logout(req, res) {
        req.session.destroy(err => {
            if (err) throw err;
        });
        res.send();
    },
    async registercheck(req, res) {
        let { username, password } = req.body;
        let sql = `select * from users where username='${username}'`;
        let data = await model(sql);
        if (data.length) return res.json(usernrepeat);
        password = md5(`${password}${secret}`);
        let sql1 = `insert into users(username,password) values('${username}','${password}')`;
        let result = await model(sql1);
        if (!result.affectedRows) return res.json(serverbusy);
        res.json(registersuccess);
    },
    async edit_user(req, res) {
        let { username, avatar, nickname } = req.body;
        let sql = `update users set avatar='${avatar}',nickname='${nickname}' where username='${username}'`
        let result = await model(sql);
        if (result.affectedRows) return res.json(editsuccess);
        res.json(editfail);
    },
    async edit_user_pwd(req, res) {
        let { username, password, newpwd } = req.body;
        password = md5(`${password}${secret}`);
        let sql = `select * from users where username='${username}' and password='${password}'`
        let data = await model(sql);
        if (data.length) {
            newpwd = md5(`${newpwd}${secret}`);
            let sql1=`update users set password='${newpwd}' where username='${username}'`;
            await model(sql1);
            req.session.destroy(err => {
                if (err) throw err;
            });
            res.json(editpwdsuccess);
            return;
        }
        res.json(editpwdfail);
    }
}
module.exports = controller;