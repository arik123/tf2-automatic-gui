const profit = require('../app/profit');
const keyVal = 53;
/*
metal skus
'5002;6': 1, ref
'5001;6': 1, rec
'5000;6': 1  scrap
*/

test('polldata exists, but is empty', async () => {
	const testPolldata = {
	};
	const ret = await profit.get(testPolldata, keyVal, 0, -1, Date.now());
	expect(ret).toEqual({
		profitTotal: '0 keys, 0 ref',
		profitTimed: '0 keys, 0 ref',
		profitPlot: [],
		numberOfTrades: 0,
		overpriceProfit: '0 keys, 0 ref',
		keyValue: keyVal
	});
});

test('offer is missing all properties', async () => {
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
	const ret = await profit.get(testPolldata, keyVal, 0, -1, Date.now());
	expect(ret).toEqual({
		profitTotal: '0 keys, 0 ref',
		profitTimed: '0 keys, 0 ref',
		profitPlot: [],
		numberOfTrades: 0,
		overpriceProfit: '0 keys, 0 ref',
		keyValue: keyVal
	});
});

test('gift', async () => {
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
	const ret = await profit.get(testPolldata, keyVal, 0, -1, Date.now());
	expect(ret).toEqual({
		profitTotal: '0 keys, 0 ref',
		profitTimed: '0 keys, 0 ref',
		profitPlot: [],
		numberOfTrades: 1,
		overpriceProfit: '0 keys, 0 ref',
		keyValue: keyVal
	});
});

test('1 scrap profit, no price change', async () => {
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
	const ret = await profit.get(testPolldata, keyVal, 0, -1, Date.now());
	expect(ret).toEqual({
		profitTotal: '0.11 ref',
		profitTimed: '0.11 ref',
		profitPlot: [],
		numberOfTrades: 2,
		overpriceProfit: '0 keys, 0 ref',
		keyValue: keyVal
	});
});

test('0 scrap profit, sellprice went down', async () => {
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
	const ret = await profit.get(testPolldata, keyVal, 0, -1, Date.now());
	expect(ret).toEqual({
		profitTotal: '0 keys, 0 ref',
		profitTimed: '0 keys, 0 ref',
		profitPlot: [],
		numberOfTrades: 2,
		overpriceProfit: '0 keys, 0 ref',
		keyValue: keyVal
	});
});

test('1 scrap profit, sellprice went down, overpay 1 scrap', async () => {
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
	const ret = await profit.get(testPolldata, keyVal, 0, -1, Date.now());
	expect(ret).toEqual({
		profitTotal: '0.11 ref',
		profitTimed: '0.11 ref',
		profitPlot: [],
		numberOfTrades: 2,
		overpriceProfit: '0.11 ref',
		keyValue: keyVal
	});
});

test('2 scrap profit, sellprice went up', async () => {
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
	const ret = await profit.get(testPolldata, keyVal, 0, -1, Date.now());
	expect(ret).toEqual({
		profitTotal: '0.22 ref',
		profitTimed: '0.22 ref',
		profitPlot: [],
		numberOfTrades: 2,
		overpriceProfit: '0 keys, 0 ref',
		keyValue: keyVal
	});
});


test('4 trades, with pricechange', async () => {
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
	const ret = await profit.get(testPolldata, keyVal, 0, -1, Date.now());
	expect(ret).toEqual({
		profitTotal: '0.22 ref',
		profitTimed: '0.22 ref',
		profitPlot: [],
		numberOfTrades: 2,
		overpriceProfit: '0 keys, 0 ref',
		keyValue: keyVal
	});
});
