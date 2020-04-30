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
	const testPolldata = {
		timestamps: {
			0: 1000,
			1: 1500
		},
		offerData: {
			0: {
				dict: {
					our: {
						'5001;6': 2,
						'5000;6': 2
					},
					their: {
						'5701;6': 1
					}
				},
				value: {
					our: {
						total: 8,
						keys: 0,
						metal: 0.88
					},
					their: {
						total: 8,
						keys: 0,
						metal: 0.88
					},
					rate: 53
				},
				prices: {
					'5701;6': {
						buy: {
							keys: 0,
							metal: 0.88
						},
						sell: {
							keys: 0,
							metal: 1
						}
					}
				},
				handledByUs: true,
				isAccepted: true
			},
			1: {
				dict: {
					their: {
						'5002;6': 1
					},
					our: {
						'5701;6': 1
					}
				},
				value: {
					our: {
						total: 9,
						keys: 0,
						metal: 1
					},
					their: {
						total: 9,
						keys: 0,
						metal: 1
					},
					rate: 53
				},
				prices: {
					'5701;6': {
						buy: {
							keys: 0,
							metal: 0.88
						},
						sell: {
							keys: 0,
							metal: 1
						}
					}
				},
				handledByUs: true,
				isAccepted: true
			}
		}
	};
	const ret = profit.get(testPolldata, keyVal, 0, -1, Date.now());
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
	const testPolldata = {
		timestamps: {
			0: 1000,
			1: 1500
		},
		offerData: {
			0: {
				dict: {
					our: {
						'5001;6': 2,
						'5000;6': 2
					},
					their: {
						'5701;6': 1
					}
				},
				value: {
					our: {
						total: 8,
						keys: 0,
						metal: 0.88
					},
					their: {
						total: 8,
						keys: 0,
						metal: 0.88
					},
					rate: 53
				},
				prices: {
					'5701;6': {
						buy: {
							keys: 0,
							metal: 0.88
						},
						sell: {
							keys: 0,
							metal: 1
						}
					}
				},
				handledByUs: true,
				isAccepted: true
			},
			1: {
				dict: {
					their: {
						'5001;6': 2,
						'5000;6': 2
					},
					our: {
						'5701;6': 1
					}
				},
				value: {
					our: {
						total: 8,
						keys: 0,
						metal: 0.88
					},
					their: {
						total: 8,
						keys: 0,
						metal: 0.88
					},
					rate: 53
				},
				prices: {
					'5701;6': {
						buy: {
							keys: 0,
							metal: 0.77
						},
						sell: {
							keys: 0,
							metal: 0.88
						}
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
		numberOfTrades: 2,
		overpriceProfit: '0 keys, 0 ref',
		keyValue: keyVal,
		stock: {}
	});
});

test('1 scrap profit, sellprice went down, overpay 1 scrap', () => {
	const testPolldata = {
		timestamps: {
			0: 1000,
			1: 1500
		},
		offerData: {
			0: {
				dict: {
					our: {
						'5001;6': 2,
						'5000;6': 2
					},
					their: {
						'5701;6': 1
					}
				},
				value: {
					our: {
						total: 8,
						keys: 0,
						metal: 0.88
					},
					their: {
						total: 8,
						keys: 0,
						metal: 0.88
					},
					rate: 53
				},
				prices: {
					'5701;6': {
						buy: {
							keys: 0,
							metal: 0.88
						},
						sell: {
							keys: 0,
							metal: 1
						}
					}
				},
				handledByUs: true,
				isAccepted: true
			},
			1: {
				dict: {
					their: {
						'5002;6': 1
					},
					our: {
						'5701;6': 1
					}
				},
				value: {
					our: {
						total: 8,
						keys: 0,
						metal: 0.88
					},
					their: {
						total: 9,
						keys: 0,
						metal: 1
					},
					rate: 53
				},
				prices: {
					'5701;6': {
						buy: {
							keys: 0,
							metal: 0.77
						},
						sell: {
							keys: 0,
							metal: 0.88
						}
					}
				},
				handledByUs: true,
				isAccepted: true
			}
		}
	};
	const ret = profit.get(testPolldata, keyVal, 0, -1, Date.now());
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
	const testPolldata = {
		timestamps: {
			0: 1000,
			1: 1500
		},
		offerData: {
			0: {
				dict: {
					our: {
						'5001;6': 2,
						'5000;6': 2
					},
					their: {
						'5701;6': 1
					}
				},
				value: {
					our: {
						total: 8,
						keys: 0,
						metal: 0.88
					},
					their: {
						total: 8,
						keys: 0,
						metal: 0.88
					},
					rate: 53
				},
				prices: {
					'5701;6': {
						buy: {
							keys: 0,
							metal: 0.88
						},
						sell: {
							keys: 0,
							metal: 1
						}
					}
				},
				handledByUs: true,
				isAccepted: true
			},
			1: {
				dict: {
					their: {
						'5002;6': 1
					},
					our: {
						'5701;6': 1
					}
				},
				value: {
					our: {
						total: 10,
						keys: 0,
						metal: 1.11
					},
					their: {
						total: 10,
						keys: 0,
						metal: 1.11
					},
					rate: 53
				},
				prices: {
					'5701;6': {
						buy: {
							keys: 0,
							metal: 1
						},
						sell: {
							keys: 0,
							metal: 1.11
						}
					}
				},
				handledByUs: true,
				isAccepted: true
			}
		}
	};
	const ret = profit.get(testPolldata, keyVal, 0, -1, Date.now());
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
	const testPolldata = {
		timestamps: {
			0: 1000,
			1: 1500,
			2: 2000,
			3: 2500
		},
		offerData: {
			0: {
				dict: {
					our: {
						'5002;6': 8
					},
					their: {
						'5701;6': 9
					}
				},
				value: {
					our: {
						total: 72,
						keys: 0,
						metal: 8
					},
					their: {
						total: 72,
						keys: 0,
						metal: 8
					},
					rate: 53
				},
				prices: {
					'5701;6': {
						buy: {
							keys: 0,
							metal: 0.88
						},
						sell: {
							keys: 0,
							metal: 1
						}
					}
				},
				handledByUs: true,
				isAccepted: true
			},
			1: {
				dict: {
					their: {
						'5002;6': 3
					},
					our: {
						'5701;6': 3
					}
				},
				value: {
					our: {
						total: 9,
						keys: 0,
						metal: 1
					},
					their: {
						total: 9,
						keys: 0,
						metal: 1
					},
					rate: 53
				},
				prices: {
					'5701;6': {
						buy: {
							keys: 0,
							metal: 0.88
						},
						sell: {
							keys: 0,
							metal: 1
						}
					}
				},
				handledByUs: true,
				isAccepted: true
			},
			2: {
				dict: {
					our: {
						'5002;6': 9
					},
					their: {
						'5701;6': 9
					}
				},
				value: {
					our: {
						total: 81,
						keys: 0,
						metal: 9
					},
					their: {
						total: 81,
						keys: 0,
						metal: 9
					},
					rate: 53
				},
				prices: {
					'5701;6': {
						buy: {
							keys: 0,
							metal: 1
						},
						sell: {
							keys: 0,
							metal: 1.11
						}
					}
				},
				handledByUs: true,
				isAccepted: true
			},
			3: {
				dict: {
					their: {
						'5002;6': 16,
						'5001;6': 2
					},
					our: {
						'5701;6': 15
					}
				},
				value: {
					our: {
						total: 150,
						keys: 0,
						metal: 16.66
					},
					their: {
						total: 150,
						keys: 0,
						metal: 16.66
					},
					rate: 53
				},
				prices: {
					'5701;6': {
						buy: {
							keys: 0,
							metal: 1
						},
						sell: {
							keys: 0,
							metal: 1.11
						}
					}
				},
				handledByUs: true,
				isAccepted: true
			}
		}
	};
	const ret = profit.get(testPolldata, keyVal, 0, -1, Date.now());
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
	const testPolldata = {
		timestamps: {
			0: 1000,
			1: 1500,
			2: 2000,
			3: 2500
		},
		offerData: {
			0: { // 8 * 9
				dict: {
					our: {
						'5002;6': 8
					},
					their: {
						'5701;6': 9
					}
				},
				value: {
					our: {
						total: 72,
						keys: 0,
						metal: 8
					},
					their: {
						total: 72,
						keys: 0,
						metal: 8
					},
					rate: 53
				},
				prices: {
					'5701;6': {
						buy: {
							keys: 0,
							metal: 0.88
						},
						sell: {
							keys: 0,
							metal: 1
						}
					}
				},
				handledByUs: true,
				isAccepted: true
			},
			1: { // 8 * 6
				dict: {
					their: {
						'5002;6': 3
					},
					our: {
						'5701;6': 3
					}
				},
				value: {
					our: {
						total: 27,
						keys: 0,
						metal: 3
					},
					their: {
						total: 27,
						keys: 0,
						metal: 3
					},
					rate: 53
				},
				prices: {
					'5701;6': {
						buy: {
							keys: 0,
							metal: 0.88
						},
						sell: {
							keys: 0,
							metal: 1
						}
					}
				},
				handledByUs: true,
				isAccepted: true
			},
			2: { // 8.6 * 15
				dict: {
					our: {
						'5002;6': 9
					},
					their: {
						'5701;6': 9
					}
				},
				value: {
					our: {
						total: 81,
						keys: 0,
						metal: 9
					},
					their: {
						total: 81,
						keys: 0,
						metal: 9
					},
					rate: 53
				},
				prices: {
					'5701;6': {
						buy: {
							keys: 0,
							metal: 1
						},
						sell: {
							keys: 0,
							metal: 1.11
						}
					}
				},
				handledByUs: true,
				isAccepted: true
			},
			3: { // 8.6 * 5
				dict: {
					their: {
						'5002;6': 12,
						'5000;6': 2
					},
					our: {
						'5701;6': 10
					}
				},
				value: {
					our: {
						total: 110,
						keys: 0,
						metal: 12.22
					},
					their: {
						total: 110,
						keys: 0,
						metal: 12.22
					},
					rate: 53
				},
				prices: {
					'5701;6': {
						buy: {
							keys: 0,
							metal: 1
						},
						sell: {
							keys: 0,
							metal: 1.11
						}
					}
				},
				handledByUs: true,
				isAccepted: true
			}
		}
	};
	const ret = profit.get(testPolldata, keyVal, 0, -1, Date.now());
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
	const testPolldata = {
		timestamps: {
			0: 1000,
			1: 1500,
			2: 2000,
			3: 2500,
			4: 3000,
			5: 3500
		},
		offerData: {
			0: { // 8 * 9
				dict: {
					our: {
						'5002;6': 8
					},
					their: {
						'5701;6': 9
					}
				},
				value: {
					our: {
						total: 72,
						keys: 0,
						metal: 8
					},
					their: {
						total: 72,
						keys: 0,
						metal: 8
					},
					rate: 53
				},
				prices: {
					'5701;6': {
						buy: {
							keys: 0,
							metal: 0.88
						},
						sell: {
							keys: 0,
							metal: 1
						}
					}
				},
				handledByUs: true,
				isAccepted: true
			},
			1: { // 8 * 6
				dict: {
					their: {
						'5002;6': 3
					},
					our: {
						'5701;6': 3
					}
				},
				value: {
					our: {
						total: 27,
						keys: 0,
						metal: 3
					},
					their: {
						total: 27,
						keys: 0,
						metal: 3
					},
					rate: 53
				},
				prices: {
					'5701;6': {
						buy: {
							keys: 0,
							metal: 0.88
						},
						sell: {
							keys: 0,
							metal: 1
						}
					}
				},
				handledByUs: true,
				isAccepted: true
			},
			2: { // 8.6 * 15
				dict: {
					our: {
						'5002;6': 9
					},
					their: {
						'5701;6': 9
					}
				},
				value: {
					our: {
						total: 81,
						keys: 0,
						metal: 9
					},
					their: {
						total: 81,
						keys: 0,
						metal: 9
					},
					rate: 53
				},
				prices: {
					'5701;6': {
						buy: {
							keys: 0,
							metal: 1
						},
						sell: {
							keys: 0,
							metal: 1.11
						}
					}
				},
				handledByUs: true,
				isAccepted: true
			},
			3: { // 8.6 * 5
				dict: {
					their: {
						'5002;6': 12,
						'5000;6': 2
					},
					our: {
						'5701;6': 10
					}
				},
				value: {
					our: {
						total: 110,
						keys: 0,
						metal: 12.22
					},
					their: {
						total: 110,
						keys: 0,
						metal: 12.22
					},
					rate: 53
				},
				prices: {
					'5701;6': {
						buy: {
							keys: 0,
							metal: 1
						},
						sell: {
							keys: 0,
							metal: 1.11
						}
					}
				},
				handledByUs: true,
				isAccepted: true
			},
			4: { // 9.5 * 14
				dict: {
					our: {
						'5002;6': 10
					},
					their: {
						'5701;6': 9
					}
				},
				value: {
					our: {
						total: 90,
						keys: 0,
						metal: 10
					},
					their: {
						total: 90,
						keys: 0,
						metal: 10
					},
					rate: 53
				},
				prices: {
					'5701;6': {
						buy: {
							keys: 0,
							metal: 1.11
						},
						sell: {
							keys: 0,
							metal: 1.22
						}
					}
				},
				handledByUs: true,
				isAccepted: true
			},
			5: { // 9.5 * 4
				dict: {
					their: {
						'5002;6': 13,
						'5001;6': 1
					},
					our: {
						'5701;6': 10
					}
				},
				value: {
					our: {
						total: 110,
						keys: 0,
						metal: 13.33
					},
					their: {
						total: 110,
						keys: 0,
						metal: 13.33
					},
					rate: 53
				},
				prices: {
					'5701;6': {
						buy: {
							keys: 0,
							metal: 1.11
						},
						sell: {
							keys: 0,
							metal: 1.22
						}
					}
				},
				handledByUs: true,
				isAccepted: true
			}
		}
	};
	const ret = profit.get(testPolldata, keyVal, 0, -1, Date.now());
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
