const express = require('express');
const router = express.Router();
const profit = require('../profit');
const fs = require('fs-extra');
const paths = require('../../resources/paths');

router.get('/', (req, res) => { // maybe make this async
	if (req.query.json=='true') {
		if (!fs.existsSync(paths.files.polldata)) {
			res.json({
				success: 0
			});
			return;
		} else {
			fs.readJSON(paths.files.polldata)
				.then((polldata)=>{
					autoprice('5021;6')
						.then((resp) => {
							profit.get(polldata, Number(req.query.start), Number(req.query.interval), Number(req.query.end))
								.then((data) => {
									res.json({
										success: 1,
										data
									});
								})
								.catch((err) => {
									res.json({
										success: 0
									});
								});
						})
						.catch((err) => {
							res.json({
								success: 0
							});
						});
				})
				.catch((err)=>{
					res.json({
						success: 0
					});
				});
		}
	} else {
		res.render('profit');
	}
});

module.exports = router;
