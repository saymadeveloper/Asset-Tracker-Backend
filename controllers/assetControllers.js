const mongoose = require("mongoose");
const dbConn = require("../db/database");
const userModel = require("../model/userModel");
const assetModel = require("../model/assetModel");
const utils = require("../utils/utils");
module.exports = {
  get: {
    getAllItemsGlobal: async (req, res, next) => {
      // const options = {
      //   // sort in descending (-1) order by rating
      //   //sort : { rating: -1 },
      //   // omit the first two documents
      //   sort: { created_at: -1 },
      //   // skip: limit * pageNo,
      //   // limit: limit,
      // };  keno use hole
      assetModel
        // .find({ status: "borrowed" }, null, options) keno use hole
        .find({ status: "borrowed" })
        .then((result) => {
          return res.json({
            status: 200,
            count: result.length,
            data: result,
          });
        })
        .catch((err) => {
          return res.json({
            status: 500,
            message: "Erro" + err,
          });
        });
    },
    getTotalItemCount: async (req, res, next) => {
      const owner_id = req.user._id;
      assetModel
        .find({ owner_id: mongoose.Types.ObjectId(owner_id) })
        .then((result) => {
          //---------"created", "working", "completed", "deleted"
          let borrowed = 0;
          let returned = 0;
          let deleted = 0;
          for (let i = 0; i < result.length; i++) {
            if (result[i].status === "borrowed") {
              borrowed += 1;
            } else if (result[i].status === "returned") {
              returned += 1;
            } else if (result[i].status === "deleted") {
              deleted += 1;
            }
          }

          let total = borrowed + returned + deleted;

          return res.json({
            status: 200,
            data: {
              total: total,
              borrowed: borrowed,
              returned: returned,
              deleted: deleted,
            },
          });
        })
        .catch((err) => {
          return res.json({
            status: 500,
            message: "Error" + err,
          });
        });
    },
  },
  post:{
    addNewItem: async (req, res, next) => {
      const name = req.body.name;
      const description = req.body.description;
      const borrower_name = req.body.borrower_name;
      const owner_id = req.user._id;
      const owner_name = req.user.name;
      const status = "borrowed";
      const created_at = utils.getCurrentDate();
      const modified_at = utils.getCurrentDate();

      assetModel
        .create({
          name,
          description,
          owner_id,
          owner_name,
          borrower_name,
          status,
          created_at,
          modified_at,
        })
        .then((result) => {
          return res.json({
            status: 200,
            message: "Item added successfully!",
            data: result,
          });
        })
        .catch((err) => {
          return res.json({
            status: 500,
            message: "Error" + err,
          });
        });
    },
    getAllItems: async (req, res, next) => {
      console.log(req)
      const id = req.user._id;
      const status = req.body.status;

      const options = {
        // sort in descending (-1) order by rating
        //sort : { rating: -1 },
        // omit the first two documents
        sort: { created_at: -1 },
        // skip: limit * pageNo,
        // limit: limit,
      };

      assetModel
        // .find({ status: { $ne: "deleted" } })
        .find(
          { owner_id: mongoose.Types.ObjectId(id), status: status },
          null,
          options
        )
        .then((result) => {
          return res.json({
            status: 200,
            count: result.length,
            data: result,
          });
        })
        .catch((err) => {
          return res.json({
            status: 500,
            message: "Erro" + err,
          });
        });
    },
    changeItemStatus: async (req, res, next) => {
      const id = req.user._id;

      const item_id = req.body.item_id;
      const status = req.body.status;
      assetModel
        // .find({ status: { $ne: "deleted" } })
        //.find({ owner_id: mongoose.Types.ObjectId(id), status: status })
        .updateOne(
          {
            _id: mongoose.Types.ObjectId(item_id),
            owner_id: mongoose.Types.ObjectId(id),
          },
          {
            $set: {
              status: status,
            },
          }
        )
        .then((result) => {
          return res.json({
            status: 200,
            message: "Item status changed succeessfully",
          });
        })
        .catch((err) => {
          return res.json({
            status: 500,
            message: "Erro" + err,
          });
        });
    },
  },
  delete:{
    deleteItem: async (req, res, next) => {
      const owner_id = req.user._id;
      const item_id = req.body.item_id;
      assetModel
        // .find({ status: { $ne: "deleted" } })
        //.find({ owner_id: mongoose.Types.ObjectId(id), status: status })
        //.updateOne({owner_id: mongoose.Types.ObjectId(id)},
        .deleteOne({
          _id: mongoose.Types.ObjectId(item_id),
          owner_id: owner_id,
        })
        .then((result) => {
          return res.json({
            status: 200,
            message: "Item deleted!",
          });
        })
        .catch((err) => {
          return res.json({
            status: 500,
            message: "Erro" + err,
          });
        });
    },
  }
};
