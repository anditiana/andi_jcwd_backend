const db = require('../models');
const user = db.blog;
const dbCat = db.category;
const dbLike = db.like_activity;
const acc = db.account;
const jwt = require('jsonwebtoken');
const enkrip = require('bcrypt');
const { Op, Sequelize } = require('sequelize');
const  transporter  = require('../midleware/etransporter');
const handlebars = require('handlebars');


const blogController = {
  create: async (req, res)=>{
    try {
      const {title, content, category, country, keywords, vidURL} = req.body;
      const {filename} = req.file;
      const {id} = req.user; 
      // console.log(req.file);
      const result = await user.create({
        title : title,
        imgURL : filename,
        vidURL : vidURL,
        content : content,
        keywords : keywords,
        country : country,
        accountId : id,
        category_id : category
      });
      res.status(200).send({
        status : true,
        message : 'success'
        // data : result
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  getBlog : async (req,res)=>{
    try {
      // console.log(req.query);
      const page = +req.query.page || 1;
      const limit = +req.query.limit || 10;
      
      // const {sort , sortBy} = req.query;
      
      const sortBy = req.query.sortBy || 'createdAt'; 
      const sort = req.query.sort || 'DESC'; 
      const setSort = [`${sortBy}`, `${sort}`];
      
      const clause = [];

      if (req.query.id_cat) {
          clause.push({categoryId: req.query.id_cat});
      }
      if (req.query.keywords) {
        clause.push({keywords:{[Op.like]: `%${req.query.keywords}%`}});
      }
      
      const getData = await user.findAll({
        where : {
          [Op.and]: clause
        },
        limit,
        order: [setSort],
        offset: limit * (page - 1)
      });
      // console.log(getData);
      const total = await user.count();
      // console.log(total);

      res.status(200).send({
        status : true,
        totalPage : Math.ceil(total / limit),
        currentPage : page,
        message : 'Success',
        getData

      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  getBlogById : async (req, res) => {
    try {
      // console.log(req.body.id);
      const limit = 10;
      const page = 1;
      const setSort = ['createAt', 'DESC'];
      
      const result = await user.findAll({
        where : {
          accountId : req.body.id
        },
        limit,
        order : [['createdAt' , 'DESC']]
      });

      console.log(result == false);
      if (result == false) {
        res.status(200).send({
          message :'Success',
          currentPage : page,
          result : 'You have never created a blog'
        });
      }else{
        res.status(200).send({
          message :'Success',
          currentPage : page,
          result
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error)
    }
  },
  //ini belum selesai
  getLikedBlog: async (req, res) => {
    try {
      // console.log(req.body.id);
      const limit = 10;
      const page = 1;
      const setSort = ['createAt', 'DESC'];

      const result = await user.findAll({
        where : {
          accountId : req.body.id
        },
        limit,
        order : [['createdAt' , 'DESC']]
      });

      res.status(200).send({
        message :'Success',
        currentPage : page,
        result
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error)
    }
  },

  allCategory : async (req,res) => {
    try {
      const cat = await dbCat.findAll();
      res.status(200).send({
        status : 'OK',
        cat
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  like : async (req, res) => {
    try {
      const isLike = await dbLike.findOne({
        where :{
          [Op.and] : [{accountId : req.user.id},{blogBlogId :req.body.blog_id}]
        }
      });

      if (isLike) {
        const setUnlike = await dbLike.destroy({
          where : {
            [Op.and] : [{accountId : req.user.id},{blogBlogId :req.body.blog_id}]
          }
        });
        res.status(200).send({
          message : 'Success to Unlike'
        });
        // throw ({message : 'already liked'});
      }else{
        const setLike = await dbLike.create({accountId : req.user.id, blogBlogId :req.body.blog_id});
        res.status(200).send({
          message : 'Like Success'
        });
      }
    } catch (error) {
      res.status(400).send(error);
    }
  },
  likedBlogById: async(req,res)=>{
    try {
      const myId = req.user.id;
      const likes = await dbLike.findAll({
        attributes: ['accountId', 'blogBlogId'],
        where: {
          accountId: myId,
        },
        include: [
          {
            model:acc,
            attributes: ['username'],
          },
          {
            model: user,
            attributes: ['title', 'content', 'keywords', 'category_id', 'imgURL', 'vidURL', 'createdAt'],
          },
        ]
      });
       
      if (likes == false) {
        res.status(200).send({
          message : 'There are no blogs you like'
        });
      }else{
        res.status(200).send({
          message : 'Ok',
          result : likes
        });  
      }
      
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}
}

module.exports = blogController;
