const router = require('express').Router();
const thoughtRoutes = require('./thoughtRoute.js');
const userRoutes = require('./userRoutes.js');

router.use('/thought', thoughtRoutes);
router.use('/user', userRoutes);

module.exports = router;
