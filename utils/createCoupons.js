const createCoupons = () => {

    const newUserCouponPack = [
        { type: 'c1', name: '신규회원', value: 3000, unit: 'won', applicableTo: 'all', valid: true },
        { type: 'c2', name: '스페셜', value: 10, unit: 'percent', minPurchase: 70000, applicableTo: 'all', valid: true },
        { type: 'c3', name: '스페셜', value: 15, unit: 'percent', minPurchase: 90000, applicableTo: 'all', valid: true },
        // { type: 'c4', name: '신상품할인', value: 5, unit: 'percent', applicableTo: 'newProduct', valid: true }
    ];

    return newUserCouponPack;
}

module.exports = { createCoupons };