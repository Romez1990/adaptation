function request(url, method, body) {
    const baseUrl = '/api/';
    return new Promise((resolve, reject) =>
        $.ajax(baseUrl + url, {
            type: method,
            body,
            success: resolve,
            error: reject,
        })
    );
}

async function main() {
    const result = await request('auth/login/', {
        email: 'admin@example.com',
        password: 'adaptation',
    });
    console.log(result);
}

main();
