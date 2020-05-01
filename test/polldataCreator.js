const Currencies = require('tf2-currencies');
/**
 *
 */
class polldataCreator {
	/**
	 * @typedef Currency
	 * @type {Object}
	 * @property {Number} keys
	 * @property {Number} scrap
	 */
	/**
	 * @typedef Prices
	 * @type {Object}
	 * @property {Currency} sell
	 * @property {Currency} buy
	 */


	/**
	 * creates empty polldata
	 */
	constructor() {
		this.polldata = {
			timestamps: {
			},
			offerData: {
			}
		};
	}

	/**
	 * 
	 * @param {Boolean} sold if item was sold
	 * @param {Number|String} ID item id (sku), profit calc does not care
	 * @param {Number} count count of items sold
	 * @param {Prices} pricesForID sell:{keys, scrap} buy:{keys, scrap}
	 * @param {Number} keyprice keyprice in metal
	 * @param {Currency} [overprice] {keys, scrap}
	 * @param {Boolean} [accepted = true] if trade got accepted
	 * @param {Number} [append] offer to append to, undefined if not appending
	 * @return {this}
	 */
	add(sold, ID, count, pricesForID, keyprice, overprice, accepted = true, append) {
		let index;
		if (typeof append === 'undefined' || append === null) {
			index = Object.keys(this.polldata.timestamps).length;
			this.polldata.timestamps[index] = index;
		} else {
			index = append;
		}
		if (!Object.prototype.hasOwnProperty.call(this.polldata.offerData, index)) {
			this.polldata.offerData[index] = {
				dict: {
					their: {
					},
					our: {
					}
				},
				value: {
					our: {
						total: 0,
						keys: 0,
						metal: 0
					},
					their: {
						total: 0,
						keys: 0,
						metal: 0
					},
					rate: keyprice
				},
				prices: {
				},
				handledByUs: true,
				isAccepted: accepted
			};
		}
		const side = sold ? 'our' : 'their';
		this.polldata.offerData[index].prices[ID] = pricesForID;
		if (!Object.prototype.hasOwnProperty.call(this.polldata.offerData[index].dict[side], ID)) {
			this.polldata.offerData[index].dict[side][ID] = count;
		} else {
			this.polldata.offerData[index].dict[side][ID] += count;
		}
		this.calculateCurrency(sold, index, overprice);
		return this;
	}

	/**
	 * adds 
	 * @param {Boolean} sold if we are handling sold items
	 * @param {Number} index offer index (id)
	 * @param {Currency} overprice
	 */
	calculateCurrency(sold, index, overprice) {
		const side = sold ? 'our' : 'their';
		const oposite = sold ? 'their' : 'our';
		const priceType = sold ? 'sell' : 'buy';
		const total = {
			keys: 0,
			metal: 0
		};
		for (const ID in this.polldata.offerData[index].dict[side]) {
			if (this.polldata.offerData[index].dict[side].hasOwnProperty(ID)) {
				const itemCount = this.polldata.offerData[index].dict[side][ID];
				total.keys += this.polldata.offerData[index].prices[ID][priceType].keys * itemCount;
				total.metal = Currencies.toRefined(Currencies.toScrap(total.metal) + Currencies.toScrap(this.polldata.offerData[index].prices[ID][priceType].metal) * itemCount);
			}
		}
		this.polldata.offerData[index].value[side].keys = total.keys;
		this.polldata.offerData[index].value[side].metal = total.metal;
		this.polldata.offerData[index].value[side].total = new Currencies(total).toValue(this.polldata.offerData[index].rate);
		// add overprice
		if (overprice) {
			if (sold) {
				total.keys += overprice.keys;
				total.metal += Currencies.toRefined(overprice.scrap);
			} else {
				total.keys -= overprice.keys;
				total.metal -= Currencies.toRefined(overprice.scrap);
			}
		}
		
		this.polldata.offerData[index].value[oposite].keys = total.keys;
		this.polldata.offerData[index].value[oposite].metal = total.metal;
		this.polldata.offerData[index].value[oposite].total = new Currencies(total).toValue(this.polldata.offerData[index].rate);
		this.polldata.offerData[index].dict[oposite]['5021;6'] = total.keys;
		this.polldata.offerData[index].dict[oposite]['5002;6'] = Math.floor(total.metal);
		const scrap = Currencies.toScrap(total.metal % 1);
		this.polldata.offerData[index].dict[oposite]['5001;6'] = Math.floor(scrap / 3);
		this.polldata.offerData[index].dict[oposite]['5000;6'] = scrap % 3;
	}

	/**
	 * trade data
	 */
	get Polldata() {
		return this.polldata;
	}
};

const prices = {
	sell: {
		keys: 0,
		metal: 1
	},
	buy: {
		keys: 0,
		metal: 2
	}
};
module.exports = polldataCreator;
const polldat = new polldataCreator()
	.add(false, '1;6', 1, prices, 55)
	.add(true, '1;6', 1, prices, 55);
console.log(JSON.stringify(polldat.Polldata));
