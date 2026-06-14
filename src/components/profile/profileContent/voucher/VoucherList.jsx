import VoucherCard from "@/components/card/cart/VoucherCard";
import couponServices from "@/services/couponServices";
import React, { useEffect, useState } from "react";

const VoucherList = () => {
  const [vouchers, setVouchers] = useState([]);
  useEffect(() => {
    const fetchVouchers = async () => {
      const res = await couponServices.getAllCoupons();
      setVouchers(res.data);
      console.log("vouchers", res.data);
    };
    fetchVouchers();
  }, []);
  return (
    <div className="space-y-8">
      <p className="text-2xl sm:text-4xl font-semibold tracking-wide">Ví Voucher</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vouchers
          ?.filter((coupon) => {
            const isExpired = coupon.endDate ? new Date(coupon.endDate) < new Date() : false;
            return coupon.isActive === true && !isExpired;
          })
          .map((coupon) => (
            <div className="h-30" key={coupon.id}>
              <VoucherCard couponData={coupon} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default VoucherList;
