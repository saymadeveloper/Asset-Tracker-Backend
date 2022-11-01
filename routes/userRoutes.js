const controllers = require("../controllers");
const router = require("express").Router();
const utils = require("../utils/utils");

router.post("/register-user", controllers.user.post.registerNewUser);
router.post("/login-user", controllers.user.post.loginUser);

router.get("/get-users", utils.authenticateToken, controllers.user.get.getAllUsers);

router.put("/update-user-role", utils.authenticateToken, controllers.user.put.updateUserRole
);

router.delete(
    "/delete-user",
    utils.authenticateToken,
    controllers.user.delete.deleteUser
);

  

module.exports = router;