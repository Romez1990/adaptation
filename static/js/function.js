
function auth(){
    console.log('true')
    console.log($(this).serialize());
}

$( "#form-user" ).on( "submit", function( event ) {
    event.preventDefault();

    let dataAuthUser = $('#form-user').serialize();

    console.log(dataAuthUser);

    request('auth/login/','post',dataAuthUser)

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