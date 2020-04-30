const express = require('express');
const router = express.Router();
const autoprice = require('../autoprice');

router.get('/', (req, res) => {
	if (!req.query.sku || !isSKU(req.query.sku)) {
		res.json({
			success: false
		});
		return;
	}
	autoprice(req.query.sku)
		.then((resp) = {

		})
		.catch((err) => {
			throw err;
		});
});

module.exports = router;

/**
 * 
 * @param {String} str string to check
 * @return {Boolean} 
 */
function isSKU(str) {
	return str.split(';').length > 1 && Number.isInteger(Number(str.split(';')[0])) && Number.isInteger(Number(str.split(';')[1]));
}
