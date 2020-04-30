/**
 * 
 * @param {String} sku item sku
 * @return {Object} item prices
 */
module.exports = async function(sku) {
	try {
		const resp = await axios({
			method: 'get',
			url: `https://api.prices.tf/items/${req.query.sku}`,
			params: {
				src: 'bptf'
			},
			type: 'json'
		})
		return resp.data;
	} catch (err) {
		throw err;
	}
}
