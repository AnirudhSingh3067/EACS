import http from 'http';

async function testApis() {
    const patientId = "test-patient-123";
    const professionalId = "test-prof-456";
    const startTime = new Date(Date.now() + 1000 * 60 * 60).toISOString(); // 1 hour from now
    const endTime = new Date(Date.now() + 1000 * 60 * 120).toISOString(); // 2 hours from now

    console.log("1. Booking a session...");

    const postReq = http.request({
        hostname: 'localhost',
        port: 9002,
        path: '/api/book-session',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-user-id': patientId,
        }
    }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`POST Status: ${res.statusCode}`);
            console.log(`POST Response: ${data}`);

            console.log("\n2. Fetching sessions...");
            const getReq = http.request({
                hostname: 'localhost',
                port: 9002,
                path: '/api/sessions',
                method: 'GET',
                headers: {
                    'x-user-id': patientId,
                }
            }, (getRes) => {
                let getData = '';
                getRes.on('data', chunk => getData += chunk);
                getRes.on('end', () => {
                    console.log(`GET Status: ${getRes.statusCode}`);
                    console.log(`GET Response: ${getData}`);
                });
            });
            getReq.end();
        });
    });

    postReq.write(JSON.stringify({
        professionalId,
        startTime,
        endTime
    }));
    postReq.end();
}

testApis();
