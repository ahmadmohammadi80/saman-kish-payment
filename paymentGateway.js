const axios = require('axios');

class SamanKishPayment {
  constructor(merchantId, redirectUrl) {
    this.MID = merchantId;
    this.RedirectURL = redirectUrl;  // اطمینان از مقداردهی درست RedirectURL
    this.apiUrl = 'https://sep.shaparak.ir/Payment.aspx'; // آدرس درگاه سامان کیش
  }

  // درخواست پرداخت به درگاه
  async requestPayment(ResNum, Amount, ResNum1) {
    const data = {
      MID: this.MID,
      ResNum: ResNum,
      Amount: Amount,
      RedirectURL: this.RedirectURL,  // ارسال RedirectURL به درگاه
      ResNum1: ResNum1,
    };

    try {
      const response = await axios.post(this.apiUrl, data);
      
      // چاپ کامل پاسخ از درگاه برای بررسی اینکه RedirectURL به درستی دریافت می‌شود
      console.log('Response from payment gateway:', response.data);

      if (response.status === 200) {
        return { success: true, redirectUrl: response.data.RedirectURL };  // بررسی RedirectURL در پاسخ
      } else {
        throw new Error('Payment request failed');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // تایید تراکنش از درگاه
  async verifyTransaction(ResNum, Amount, refNum, securityCode) {
    const data = {
      MID: this.MID,
      ResNum: ResNum,
      Amount: Amount,
      RefNum: refNum,
      SecurityCode: securityCode,
    };

    try {
      const response = await axios.post(this.apiUrl, data);
      if (response.status === 200) {
        return { success: true, message: 'Transaction Verified' };
      } else {
        throw new Error('Transaction verification failed');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = SamanKishPayment;
