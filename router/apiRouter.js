const express = require('express');
const router = express.Router();
const model = require('../model/model.js');

router.get('/cate', async (req, res) => {
    let sql = `select * from category`;
    let data = await model(sql);
    res.json(data);
});

router.get('/article', async (req, res) => {
    let { cate_id, page = 1, limit = 5 } = req.query;
    let offset = (page - 1) * limit;
    let sql = `select t1.*,t2.cate_name from article t1 left join category t2 
        on t1.category=t2.cate_id 
        where status=0 `;
    cate_id && (sql += `and category=${cate_id} `);
    sql += `order by t1.added_time desc limit ${offset},${limit}`;
    let data = await model(sql);
    data.forEach(v => {
        v.cover && (v.cover = `http://localhost:4000/${v.cover}`);
    });
    res.json(data);
});

router.get('/artcontent/:art_id', async (req, res) => {
    let { art_id } = req.params;
    let sql = `select t1.*,t2.cate_name from article t1 left join category t2 
        on t1.category=t2.cate_id where art_id=${art_id}`;
    let data = await model(sql);
    res.json(data[0] || {});
});

router.all('*', (req, res) => {
    res.json({ message: "请求错误" })
});

module.exports = router;