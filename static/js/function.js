
function auth(){
    console.log('true')
    console.log($(this).serialize());
}

$( "#form-user" ).on( "submit", async function( event ) {
    event.preventDefault();

    let dataAuthUser = $('#form-user').serialize();

    const result = await request('auth/login/','post',dataAuthUser)
    console.log(result);
});

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
