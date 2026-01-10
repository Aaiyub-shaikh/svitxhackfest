// Simple end-to-end test for buyer-needs flow using built-in http to avoid fetch issues
const http = await import('http');

const BASE_HOST = 'localhost';
const BASE_PORT = 3001;

const log = (label, obj) => console.log('\n=== ' + label + ' ===\n', JSON.stringify(obj, null, 2));

function httpRequest(path, method = 'GET', token = null, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_HOST,
      port: BASE_PORT,
      path,
      method,
      headers: {}
    };
    if (token) options.headers['Authorization'] = 'Bearer ' + token;
    if (body) {
      const s = JSON.stringify(body);
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(s);
    }
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    req.on('error', (err) => reject(err));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

(async () => {
  try {
    const buyer = { email: 'testbuyer@example.com', password: 'Password123!' };
    const farmer = { email: 'testfarmer@example.com', password: 'Password123!' };

    // Signup (ignore failures)
    try { log('signup buyer', await httpRequest('/api/auth/signup', 'POST', null, { email: buyer.email, password: buyer.password, userType: 'buyer', profileData: { full_name: 'Test Buyer', phone: '+911234567890', company_name: 'BuyerCo' } })); } catch (e) { console.log('signup buyer error', e.message); }
    try { log('signup farmer', await httpRequest('/api/auth/signup', 'POST', null, { email: farmer.email, password: farmer.password, userType: 'farmer', profileData: { full_name: 'Test Farmer', phone: '+919876543210', farm_name: 'FarmCo', farm_location: 'Farmville', farm_size_acres: 100 } })); } catch (e) { console.log('signup farmer error', e.message); }

    const bsign = await httpRequest('/api/auth/signin', 'POST', null, { email: buyer.email, password: buyer.password });
    log('buyer signin', bsign);
    const btoken = bsign.data?.data?.session?.access_token || bsign.data?.session?.access_token || (bsign.data && bsign.data.access_token) || null;
    if (!btoken) { console.error('Buyer token missing'); process.exit(1); }

    const post = await httpRequest('/api/buyer-needs', 'POST', btoken, { crop_name: 'wheat', quantity: 10, location: 'Testville', expected_price: '₹15000', delivery_date: '2026-02-01', contact_phone: '+911234567890', description: 'Test order' });
    log('post result', post);

    const fsign = await httpRequest('/api/auth/signin', 'POST', null, { email: farmer.email, password: farmer.password });
    log('farmer signin', fsign);
    const ftoken = fsign.data?.data?.session?.access_token || fsign.data?.session?.access_token || null;
    if (!ftoken) { console.error('Farmer token missing'); process.exit(1); }

    const get = await httpRequest('/api/buyer-needs', 'GET', ftoken, null);
    log('get needs', get);

    console.log('\nE2E test finished');
    process.exit(0);
  } catch (err) {
    console.error('E2E error', err);
    process.exit(1);
  }
})();
