const axios = require("axios");
const decryptQrCode = require("./decryptQrCode");
const genRefCode = require("./genRefCode");
const transaction = require("./transaction");

async function login() {
  try {
    const response = await axios({
      method: "post",
      url: "https://api.partners.scb/partners/sandbox/v1/oauth/token",
      headers: {
        resourceOwnerId: global.gConfig.APIKEY,
        requestUId: global.gConfig.requestUId,
        "accept-language": "EN"
      },
      data: {
        applicationKey: global.gConfig.APIKEY,
        applicationSecret: global.gConfig.APISecret
      }
    });
    return response.data;
  } catch (error) {
    console.log(error.response);
  }
}

async function slipVerification(query, AccessToken) {
  const { slipRef } = query;
  try {
    const realRef = decryptQrCode.decryptQrCode(slipRef);
    const response = await axios({
      method: "get",
      url: `https://api.partners.scb/partners/sandbox/v1/payment/billpayment/transactions/${realRef}?sendingBank=014`,
      headers: {
        authorization: AccessToken,
        requestUID: global.gConfig.requestUId,
        resourceOwnerId: global.gConfig.APIKEY,
        "accept-language": "EN"
      }
    });
    const massage = await transaction.validateTransaction(
      response.data.data.transRef
    );
    response.data = { ...response.data, massage };
    return response.data;
  } catch (error) {
    console.log(error.response);
  }
}

async function createQrcode(query, AccessToken) {
  const { amount, psid } = query;
  const ref1 = genRefCode.genRef1(psid);
  const ref2 = "DREAMTEAM";
  const ref3 = "SCBHACKATHON";
  try {
    const response = await axios({
      method: "post",
      url: "https://api.partners.scb/partners/sandbox/v1/payment/qrcode/create",
      headers: {
        authorization: AccessToken,
        requestUID: global.gConfig.requestUId,
        resourceOwnerId: global.gConfig.APIKEY,
        "accept-language": "EN"
      },
      data: {
        qrType: "PPCS",
        ppType: "BILLERID",
        ppId: global.gConfig.BillerID,
        amount: amount,
        ref1: ref1,
        ref2: ref2,
        ref3: ref3,
        merchantId: global.gConfig.MerchantID,
        terminalId: global.gConfig.TerminalID,
        invoice: "1234512",
        csExtExpiryTime: "60"
      }
    });
    transaction.initTransaction(ref1);
    return response.data;
  } catch (error) {
    console.log(error.response);
  }
}

async function createDeepLink(query, AccessToken) {
  const { amount, psid } = query;
  const ref1 = genRefCode.genRef1(psid);
  const ref2 = "DREAMTEAM";
  try {
    const response = await axios({
      method: "post",
      url: "https://api.partners.scb/partners/sandbox/v2/deeplink/transactions",
      headers: {
        authorization: AccessToken,
        requestUID: global.gConfig.requestUId,
        resourceOwnerId: global.gConfig.APIKEY,
        "accept-language": "EN",
        channel: "scbeasy"
      },
      data: {
        paymentAmount: amount,
        transactionType: "PAYMENT",
        transactionSubType: "BPA",
        ref1: ref1,
        ref2: ref2,
        accountTo: global.gConfig.BillerID,
        merchantMetaData: {
          paymentInfo: [
            {
              type: "<TEXT, TEXT_WITH_IMAGE>",
              title: "<Title text>",
              header: "<Header text>",
              description: "<Description>",
              imageUrl: "<Image url require if type TEXT_WITH_IMAGE>"
            }
          ],
          analytics: {
            "Product category": "<Product category>",
            Partner: "<Name of partner>",
            "Product code": "<Product code>",
            Detail1: "<Product name>",
            Detail2: "<sub-product name, if any>",
            Detail3: "<sub-product name, if any>",
            Detail4: "<date format: YYYY-MM-DD to YYYY-MM-DD>",
            Detail5: "<sub-product name, if any>",
            Detail6: "<Number of items, packages, etc.>"
          }
        }
      }
    });
    transaction.initTransaction(ref1);
    let deepLink = response.data.data.deeplinkUrl;
    let encodeDeepLink = encodeURIComponent(deepLink);
    response.data.data.deeplinkUrl =
      "https://zync-redirect.herokuapp.com?url=" + encodeDeepLink;
    console.log(response.data.data.deeplinkUrl);
    return response.data;
  } catch (error) {
    console.log(error.response);
  }
}

function callBackLogic(data) {
  return transaction.updateTransaction(data);
}

module.exports = {
  login,
  slipVerification,
  createQrcode,
  createDeepLink,
  callBackLogic
};
