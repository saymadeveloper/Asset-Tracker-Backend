const controllers = require("../controllers");
const router = require("express").Router();
const utils = require("../utils/utils");

router.get("/get-items-global", controllers.asset.get.getAllItemsGlobal);
router.post("/add-item",utils.authenticateToken,  controllers.asset.post.addNewItem);
router.post(
    "/get-items",
    utils.authenticateToken,
    controllers.asset.post.getAllItems
  );
  router.get(
    "/get-item-count",
    utils.authenticateToken,
    controllers.asset.get.getTotalItemCount
  );
  router.post(
    "/change-item-status",
    utils.authenticateToken,
    controllers.asset.post.changeItemStatus
  );
  router.delete(
    "/delete-item",
    utils.authenticateToken,
    controllers.asset.delete.deleteItem
  );
module.exports = router;
