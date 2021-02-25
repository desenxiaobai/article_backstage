const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const model = require('../model/model.js');
const artController = require('../controller/artController.js');
const cateController = require('../controller/cateController.js');
const userController = require('../controller/userController.js');

router.get(/^\/$|^\/index$/, (req, res) => {
    res.render('index');
});

router.get('/article', artController.article);
router.get('/art_add', artController.art_add);
router.get('/art_edit', artController.art_edit);
router.get('/getart', artController.getart);
router.post('/delart', artController.delart);
router.post('/add_art', artController.add_art);
router.post('/edit_art', artController.edit_art);
router.get('/getOneart', artController.getOneart);
router.post('/upload', upload.single('file'), artController.upload);
router.post('/updstatus', artController.updstatus);

router.get('/getCate', cateController.getCate);
router.get('/cates', cateController.cates);
router.post('/cate_add', cateController.cate_add);
router.post('/cate_edit', cateController.cate_edit);
router.post('/cate_del', cateController.cate_del);

router.get('/login', userController.login);
router.post('/checklogin', userController.checklogin);
router.get('/logout', userController.logout);
router.post('/registercheck', userController.registercheck);
router.post('/edit_user', userController.edit_user);
router.post('/edit_user_pwd', userController.edit_user_pwd);

router.get('/catecount', async (req, res) => {
    let sql = `select count(*) total,t2.cate_name,t1.category from article t1 left join category t2 
                on t1.category=t2.cate_id group by t2.cate_id`;
    let data = await model(sql);
    res.json(data);
});

router.get('/artcount', async (req, res) => {
    let sql = `select month(added_time) month,count(*) total from article
                where year(added_time)=year(now())-1 group by month(added_time)`;
    let data = await model(sql);
    res.json(data);
});

module.exports = router;