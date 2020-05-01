const polldataCreator = require('./polldataCreator');
const profit = require('../app/profit');
const keyVal = 53;
/*
metal skus
'5002;6': 1, ref
'5001;6': 1, rec
'5000;6': 1  scrap
*/

test('polldata exists, but is empty', () => {
	const testPolldata = {
	};
	const ret = profit.get(testPolldata, keyVal, 0, -1, Date.now());
	expect(ret).toEqual({
		profitTotal: '0 keys, 0 ref',
		profitTimed: '0 keys, 0 ref',
		profitPlot: [],
		numberOfTrades: 0,
		overpriceProfit: '0 keys, 0 ref',
		keyValue: keyVal,
		stock: {}
	});
});

test('offer is missing all properties', () => {
	const testPolldata = {
		timestamps: {
			3966389539: 1585330036
		},
		offerData: {
			3966389539: {
				finishTimestamp: 1585330053843
			}
		}
	};
	const ret = profit.get(testPolldata, keyVal, 0, -1, Date.now());
	expect(ret).toEqual({
		profitTotal: '0 keys, 0 ref',
		profitTimed: '0 keys, 0 ref',
		profitPlot: [],
		numberOfTrades: 0,
		overpriceProfit: '0 keys, 0 ref',
		keyValue: keyVal,
		stock: {}
	});
});

test('gift', () => {
	const testPolldata = {
		timestamps: {
			3966325519: 1585326806
		},
		offerData: {
			3966325519: {
				dict: {
					our: {},
					their: {
						'5707;6': 41
					}
				},
				handledByUs: true,
				isAccepted: true
			}
		}
	};
	const ret = profit.get(testPolldata, keyVal, 0, -1, Date.now());
	expect(ret).toEqual({
		profitTotal: '0 keys, 0 ref',
		profitTimed: '0 keys, 0 ref',
		profitPlot: [],
		numberOfTrades: 1,
		overpriceProfit: '0 keys, 0 ref',
		keyValue: keyVal,
		stock: {
			'5707;6': {
				count: 41,
				price: 0
			}
		}
	});
});

test('1 scrap profit, no price change', () => {
	const prices = {
		buy: {
			keys: 0,
			metal: 0.88
		},
		sell: {
			keys: 0,
			metal: 1
		}
	};
	const poll = new polldataCreator()
		.add(false, '5701;6', 1, prices, keyVal)
		.add(true, '5701;6', 1, prices, keyVal);
	const ret = profit.get(poll.Polldata, keyVal, 0, -1, Date.now());
	expect(ret).toEqual({
		profitTotal: '0.11 ref',
		profitTimed: '0.11 ref',
		profitPlot: [],
		numberOfTrades: 2,
		overpriceProfit: '0 keys, 0 ref',
		keyValue: keyVal,
		stock: {}
	});
});

test('0 scrap profit, sellprice went down', () => {
	const prices = {
		buy: {
			keys: 0,
			metal: 0.88
		},
		sell: {
			keys: 0,
			metal: 1
		}
	};
	const prices2 = {
		buy: {
			keys: 0,
			metal: 0.77
		},
		sell: {
			keys: 0,
			metal: 0.88
		}
	};
	const poll = new polldataCreator()
		.add(false, '5701;6', 1, prices, keyVal)
		.add(true, '5701;6', 1, prices2, keyVal);

	const ret = profit.get(poll.Polldata, keyVal, 0, -1, Date.now());
	expect(ret).toEqual({
		profitTotal: '0 keys, 0 ref',
		profitTimed: '0 keys, 0 ref',
		profitPlot: [],
		numberOfTrades: 2,
		overpriceProfit: '0 keys, 0 ref',
		keyValue: keyVal,
		stock: {}
	});
});

test('1 scrap profit, sellprice went down, overpay 1 scrap', () => {
	const prices = {
		buy: {
			keys: 0,
			metal: 0.88
		},
		sell: {
			keys: 0,
			metal: 1
		}
	};
	const prices2 = {
		buy: {
			keys: 0,
			metal: 0.77
		},
		sell: {
			keys: 0,
			metal: 0.88
		}
	};
	const poll = new polldataCreator()
		.add(false, '5701;6', 1, prices, keyVal)
		.add(true, '5701;6', 1, prices2, keyVal, {keys: 0, scrap: 1});

	const ret = profit.get(poll.Polldata, keyVal, 0, -1, Date.now());
	expect(ret).toEqual({
		profitTotal: '0.11 ref',
		profitTimed: '0.11 ref',
		profitPlot: [],
		numberOfTrades: 2,
		overpriceProfit: '0.11 ref',
		keyValue: keyVal,
		stock: {}
	});
});

test('2 scrap profit, sellprice went up', () => {
	const prices = {
		buy: {
			keys: 0,
			metal: 0.88
		},
		sell: {
			keys: 0,
			metal: 1
		}
	};
	const prices2 = {
		buy: {
			keys: 0,
			metal: 1
		},
		sell: {
			keys: 0,
			metal: 1.11
		}
	};
	const poll = new polldataCreator()
		.add(false, '5701;6', 1, prices, keyVal)
		.add(true, '5701;6', 1, prices2, keyVal);

	const ret = profit.get(poll.Polldata, keyVal, 0, -1, Date.now());
	expect(ret).toEqual({
		profitTotal: '0.22 ref',
		profitTimed: '0.22 ref',
		profitPlot: [],
		numberOfTrades: 2,
		overpriceProfit: '0 keys, 0 ref',
		keyValue: keyVal,
		stock: {}
	});
});


test('4 trades, with price change, no leftover inventory', () => {
	const prices = {
		buy: {
			keys: 0,
			metal: 0.88
		},
		sell: {
			keys: 0,
			metal: 1
		}
	};
	const prices2 = {
		buy: {
			keys: 0,
			metal: 1
		},
		sell: {
			keys: 0,
			metal: 1.11
		}
	};
	const poll = new polldataCreator()
		.add(false, '5701;6', 9, prices, keyVal)
		.add(true, '5701;6', 3, prices, keyVal)
		.add(false, '5701;6', 9, prices2, keyVal)
		.add(true, '5701;6', 15, prices2, keyVal);

	const ret = profit.get(poll.Polldata, keyVal, 0, -1, Date.now());
	expect(ret).toEqual({
		profitTotal: '2.66 ref',
		profitTimed: '2.66 ref',
		profitPlot: [],
		numberOfTrades: 4,
		overpriceProfit: '0 keys, 0 ref',
		keyValue: keyVal,
		stock: {}
	});
});

test('4 trades, with price change, leftover inventory', () => {
	const prices = {
		buy: {
			keys: 0,
			metal: 0.88
		},
		sell: {
			keys: 0,
			metal: 1
		}
	};
	const prices2 = {
		buy: {
			keys: 0,
			metal: 1
		},
		sell: {
			keys: 0,
			metal: 1.11
		}
	};
	const poll = new polldataCreator()
		.add(false, '5701;6', 9, prices, keyVal)
		.add(true, '5701;6', 3, prices, keyVal)
		.add(false, '5701;6', 9, prices2, keyVal)
		.add(true, '5701;6', 10, prices2, keyVal);
		
	const ret = profit.get(poll.Polldata, keyVal, 0, -1, Date.now());
	expect(ret).toEqual({
		profitTotal: '1.88 ref',
		profitTimed: '1.88 ref',
		profitPlot: [],
		numberOfTrades: 4,
		overpriceProfit: '0 keys, 0 ref',
		keyValue: keyVal,
		stock: {
			'5701;6': {
				count: 5,
				price: 8.6
			}
		}
	});
});

test('6 trades, with 2 price changes, leftover inventory', () => {
	const prices = {
		buy: {
			keys: 0,
			metal: 0.88
		},
		sell: {
			keys: 0,
			metal: 1
		}
	};
	const prices2 = {
		buy: {
			keys: 0,
			metal: 1
		},
		sell: {
			keys: 0,
			metal: 1.11
		}
	};
	const prices3 = {
		buy: {
			keys: 0,
			metal: 1.11
		},
		sell: {
			keys: 0,
			metal: 1.22
		}
	};
	const poll = new polldataCreator()
		.add(false, '5701;6', 9, prices, keyVal)
		.add(true, '5701;6', 3, prices, keyVal)
		.add(false, '5701;6', 9, prices2, keyVal)
		.add(true, '5701;6', 10, prices2, keyVal)
		.add(false, '5701;6', 9, prices3, keyVal)
		.add(true, '5701;6', 10, prices3, keyVal);
		
	const ret = profit.get(poll.Polldata, keyVal, 0, -1, Date.now());
	expect(ret).toEqual({
		profitTotal: '3.55 ref',
		profitTimed: '3.55 ref',
		profitPlot: [],
		numberOfTrades: 6,
		overpriceProfit: '0 keys, 0 ref',
		keyValue: keyVal,
		stock: {
			'5701;6': {
				count: 4,
				price: 9.5
			}
		}
	});
});
