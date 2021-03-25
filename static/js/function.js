if(!localStorage.getItem('token') && window.location.href.indexOf('/auth/') === -1){
     window.location.href = '/auth/'
    console.log(window.location.href)
}

if(localStorage.getItem('userStatus') === '1'){

}

//Вход
$( "#form-user" ).on( "submit", async function( event ) {
    event.preventDefault();

    let dataAuthUser = $('#form-user').serialize();

    const result = await request('auth/login/','post',dataAuthUser)
    console.log(result)
    localStorage.setItem('token',result.token);
    window.location.href = '/main/'

    getUser();
});

getUser()

function getUser(){
    $.ajax({
        url: '/../api/auth/profile/',
        type: 'GET',
        dataType: 'json',
        headers: {'Authorization': `Token ${localStorage.getItem('token')}`},
        success: function(result) {
            console.table(result)
        }
    });
}

//Выход
$('#logout').on('click', (e)=>{
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '/auth/'
})

function request(url, method, body,head) {
    const baseUrl = '/api/';
    return new Promise((resolve, reject) =>
        $.ajax(baseUrl + url, {
            type: method,
            headers: head,
            data: body,
            success: resolve,
            error: reject,
        })
    );
}
