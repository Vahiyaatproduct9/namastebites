import Razorpay from "razorpay";

export default new Razorpay({
  key_id: process.env.RZP_ID,
  key_secret: process.env.RZP_SECRET,
});
