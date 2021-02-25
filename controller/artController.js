const fs = require('fs');
const path = require('path');
const model = require('../model/model.js');
const { delsuccess, delfail, paramerr, addsuccess, addfail, editsuccess, editfail, getfail, operatesuccess, operatefail }
    = require('../config/resmsg.json');

let controller = {
    article(req, res) { res.render('article'); },
    art_add(req, res) { res.render('art_add'); },
    art_edit(req, res) { res.render('art_edit'); },

    async getart(req, res) {
        let { page, limit, art_title, status } = req.query;
        let where = `where 1`;
        art_title && (where += ` and art_title like '%${art_title}%'`);
        status && (where += ` and status=${status}`);
        let offset = (page - 1) * limit;
        let sql1 = `select t1.*,t2.cate_name from article t1 left join category t2 on t1.category=t2.cate_id 
            ${where} order by art_id desc limit ${offset},${limit}`;
        let sql2 = `select count(*) as count from article ${where}`;
        let promise1 = model(sql1);
        let promise2 = model(sql2);
        let result = await Promise.all([promise1, promise2]);
        let data = {
            code: 0,
            msg: '',
            count: result[1][0].count,
            data: result[0]
        }
        res.json(data);
    },
    async delart(req, res) {
        let { art_id } = req.body;
        if (!art_id) return res.json(paramerr);
        let sql = `delete from article where art_id=${art_id}`;
        let result = await model(sql);
        if (result.affectedRows) return res.json(delsuccess);
        res.json(delfail);
    },
    async add_art(req, res) {
        let { art_title, cover, author, category, content } = req.body;
        let sql = `insert into article(art_title,cover,author,content,category,added_time) 
            values('${art_title}','${cover}',${author},'${content}',${category},now())`;
        let result = await model(sql);
        if (result.affectedRows) return res.json(addsuccess);
        res.json(addfail);
    },
    async getOneart(req, res) {
        let { art_id } = req.query;
        if (!art_id) return res.json(paramerr);
        let sql = `select * from article where art_id=${art_id}`;
        let data = await model(sql);
        if (data.length) return res.json(data[0]);
        res.json(getfail);
    },
    async edit_art(req, res) {
        let { art_id, cover, art_title, author, category, content, status } = req.body;
        status = status == 3 ? 2 : status;
        let sql = `update article set art_title='${art_title}',cover='${cover}',author=${author}, 
            content='${content}',category=${category},status=${status} where art_id=${art_id}`;
        let result = await model(sql);
        if (result.affectedRows) return res.json(editsuccess);
        res.json(editfail);
    },
    upload(req, res) {
        if (!req.file) return res.json({ message: '没有上传文件', src: null });
        let oldFile = req.body.oldFile;
        let { originalname, destination, filename } = req.file;
        let ext = originalname.substring(originalname.lastIndexOf('.'));
        let oldPath = `${destination}${filename}`;
        let newPath = `${oldPath}${ext}`;
        fs.rename(oldPath, newPath, err => {
            if (err) throw err;
            // oldFile && fs.unlinkSync(path.join(__dirname, oldFile));
            res.json({ message: '上传成功', src: newPath });
        });
    },
    async updstatus(req, res) {
        let { art_id, status } = req.body;
        let sql = `update article set status=${status} where art_id=${art_id}`;
        let result = await model(sql);
        if (result.affectedRows) return res.json(operatesuccess);
        res.json(operatefail);
    }
};

module.exports = controller;