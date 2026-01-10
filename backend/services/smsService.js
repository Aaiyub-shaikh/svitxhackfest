import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;

function normalizeMobile(raw) {
  if (!raw) return null;
  // remove non-digits
  const digits = raw.replace(/[^0-9]/g, '');
  if (digits.length === 10) return `91${digits}`; // assume Indian number
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  if (digits.length === 13 && digits.startsWith('091')) return digits.slice(1);
  return null;
}

function buildMessage({ cropType, sowingDate, landSize, irrigationDecision, waterQuantity, bestIrrigationTime }) {
  // Only use provided values to construct a short SMS
  const parts = [];
  if (cropType) parts.push(`Crop: ${cropType}`);
  if (sowingDate) parts.push(`Sowing: ${sowingDate}`);
  if (landSize) parts.push(`Area: ${landSize}`);
  if (irrigationDecision) parts.push(`Decision: ${irrigationDecision}`);
  if (waterQuantity) parts.push(`Qty: ${waterQuantity}`);
  if (bestIrrigationTime) parts.push(`Best Time: ${bestIrrigationTime}`);
  return parts.join(' | ');
}

export async function sendIrrigationSms(payload) {
  const { mobileNumber, cropType, sowingDate, landSize, irrigationDecision, waterQuantity, bestIrrigationTime, mediaUrl } = payload;

  if (!MSG91_AUTH_KEY || !MSG91_SENDER_ID || !MSG91_TEMPLATE_ID) {
    const msg = 'MSG91 credentials are not fully configured in environment variables.';
    console.error(msg);
    throw new Error(msg);
  }

  const normalized = normalizeMobile(mobileNumber);
  if (!normalized) {
    const msg = `Invalid mobile number: ${mobileNumber}`;
    console.error(msg);
    throw new Error(msg);
  }

  const messageText = buildMessage({ cropType, sowingDate, landSize, irrigationDecision, waterQuantity, bestIrrigationTime });


  // Use the MSG91 control endpoint and payload shape that has worked in your sample:
  // - URL: https://control.msg91.com/api/v5/flow/
  // - Use `mobiles` (comma-separated string) and pass template variables as top-level keys
  const url = 'https://control.msg91.com/api/v5/flow/';

  // Primary payload (mobiles + top-level template variables)
  const bodyPrimary = {
    flow_id: MSG91_TEMPLATE_ID,
    sender: MSG91_SENDER_ID,
    mobiles: normalized,
    crop: cropType || '',
    sowingDate: sowingDate || '',
    landSize: landSize || '',
    irrigation: irrigationDecision || '',
    water: waterQuantity || '',
    time: bestIrrigationTime || '',
    message: messageText
  };
  // If a media URL is provided, include it (many templates expect `image` or `media`)
  if (mediaUrl) {
    bodyPrimary.image = mediaUrl;
    bodyPrimary.media = mediaUrl;
  }

  // Helper to post and return response or error info
  async function postFlow(body) {
    console.log('MSG91 request body:', JSON.stringify(body));
    const res = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        authkey: MSG91_AUTH_KEY
      },
      timeout: 15000
    });
    console.log(`MSG91 status ${res.status}`);
    console.log('MSG91 response body:', JSON.stringify(res.data));
    return res;
  }

  try {
    // Try primary format first
    const res = await postFlow(bodyPrimary);
    return { success: true, data: res.data };
  } catch (errPrimary) {
    console.error('Primary MSG91 call failed:', errPrimary.response ? errPrimary.response.data : errPrimary.message);

    // Fallback: use recipients array format (older/alternate shape)
    try {
      const bodyFallback = {
        flow_id: MSG91_TEMPLATE_ID,
        sender: MSG91_SENDER_ID,
        recipients: [
          {
            mobile: normalized,
            variables: {
              cropType: cropType || '',
              sowingDate: sowingDate || '',
              landSize: landSize || '',
              irrigationDecision: irrigationDecision || '',
              waterQuantity: waterQuantity || '',
              bestIrrigationTime: bestIrrigationTime || '',
              message: messageText
            }
          }
        ]
      };
      if (mediaUrl) {
        bodyFallback.recipients[0].variables.image = mediaUrl;
        bodyFallback.recipients[0].variables.media = mediaUrl;
      }
      const res2 = await postFlow(bodyFallback);
      return { success: true, data: res2.data, fallback: true };
    } catch (errFallback) {
      console.error('Fallback MSG91 call failed:', errFallback.response ? errFallback.response.data : errFallback.message);
      // Re-throw the original primary error for clarity
      throw errPrimary;
    }
  }
}

export default { sendIrrigationSms };
