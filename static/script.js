function request(url, method, body) {
    const baseUrl = '/api/';
    return new Promise((resolve, reject) =>
        $.ajax(baseUrl + url, {
            type: method,
            data: body,
            success: resolve,
            error: reject,
        })
    );
}

async function main() {
    const result = await request('auth/login/',  'post', {
        email: 'admin@example.com',
        password: 'adaptation',
    });
    console.log(result);
}

main();
