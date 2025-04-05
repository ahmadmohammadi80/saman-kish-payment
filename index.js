const express = require('express');
const SamanKishPayment = require('./paymentGateway');  // ایمپورت پکیج پرداخت
const app = express();
const port = 3000;

// وارد کردن Merchant ID و RedirectURL
const merchantId = '11026481';  // Merchant ID خود را وارد کنید
const redirectUrl = 'http://localhost:3000/result_page';  // آدرس صفحه نتیجه پرداخت

const paymentGateway = new SamanKishPayment(merchantId, redirectUrl);  // ساخت شی پکیج پرداخت

// برای دریافت داده از فرم‌ها
app.use(express.urlencoded({ extended: true }));

// صفحه اصلی با فرم پرداخت
app.get('/', (req, res) => {
  res.send(`
    <h4>IPG Sample Node.js:</h4>
    Merchant ID : 11026481<br>
    ResNum : 123456<br>
    Amount : 1000<br>
    RedirectURL : localhost/result_page<br>
    ResNum1 : 012345678901234567890123456789<br>
    <form action="/pay" method="POST">
      <input type="submit" value="پرداخت">
    </form>
  `);
});

// مسیریابی برای پرداخت
app.post('/pay', async (req, res) => {
  const MID = "11026481";
  const ResNum = "123456";
  const Amount = 1000;
  const RedirectURL = "http://localhost:3000/result_page";
  const ResNum1 = "012345678901234567890123456789";

  try {
    const paymentResult = await paymentGateway.requestPayment(ResNum, Amount, ResNum1);
    console.log('Payment result:', paymentResult);  // چاپ نتیجه درخواست پرداخت

    if (paymentResult.success) {
      console.log('Redirect URL:', paymentResult.redirectUrl);  // بررسی RedirectURL در نتیجه
      res.redirect(paymentResult.redirectUrl);  // هدایت به URL پرداخت
    } else {
      console.error('Error:', paymentResult.error);
      res.send(paymentResult.error);  // نمایش خطا
    }
  } catch (error) {
    res.send('Error during payment request');
  }
});

// صفحه نتیجه پرداخت
app.get('/result_page', (req, res) => {
  res.send('نتیجه تراکنش پرداخت شما نمایش داده خواهد شد');
});

// راه‌اندازی سرور
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
