if (!localStorage.getItem('token') && window.location.href.indexOf('/auth/') === -1) {
    window.location.href = '/auth/'
}

if (localStorage.getItem('token') && (window.location.pathname === '/' || window.location.pathname === '/auth/')) {
    window.location.href = '/main/'
}


$('#user-page-name').html(`${localStorage.getItem('userName')}`);

if (window.location.href.indexOf('/user/') > 0) {
    $('#user-page-name').html(`${localStorage.getItem('userName')}`);
    $.ajax({
        url: '/../api/auth/profile/',
        type: 'GET',
        async: 'false',
        dataType: 'json',
        headers: {'Authorization': `Token ${localStorage.getItem('token')}`},
        success: function (result) {
            showUserCard(result);
        },
    })
}

if (window.location.href.indexOf('/events/') > 0) {
    $('#user-page-name').html(`${localStorage.getItem('userName')}`);
    $.ajax({
        url: '/../api/event/',
        type: 'GET',
        async: 'false',
        dataType: 'json',
        headers: {'Authorization': `Token ${localStorage.getItem('token')}`},
        success: function (result) {
            showUserEvents(result);
        },
    })
}

if (window.location.href.indexOf('/mentor') > 0) {
    $('#user-page-name').html(`${localStorage.getItem('userName')}`);
    $.ajax({
        url: '/api/mentor/trainee/',
        type: 'GET',
        async: 'false',
        dataType: 'json',
        headers: {'Authorization': `Token ${localStorage.getItem('token')}`},
        success: function (result) {
            showTraineesMentor(result)
        },
    })
}


isTrainee()

//Вход
$("#form-user").on("submit", async function (event) {
    event.preventDefault();

    let dataAuthUser = $('#form-user').serialize();

    const result = await request('auth/login/', 'post', dataAuthUser)
    localStorage.setItem('token', result.token);


    const userInfo = await getUser();
    localStorage.setItem('userStatus', userInfo['type']);
    localStorage.setItem('userName', `${userInfo['first_name']} ${userInfo['last_name']}`);
    localStorage.setItem('userId', `${userInfo['id']}`);

    window.location.href = '/main/'
});

$('#question-page').on('click', (e) => {
    e.preventDefault();
    window.location.href = '/question/'
})

$('#map-page').on('click', (e) => {
    e.preventDefault();
    window.location.href = '/map/'
})


$('#main-page').on('click', (e) => {
    e.preventDefault();
    window.location.href = '/main/'
})

$('#user-page').on('click', (e) => {
    e.preventDefault();
    window.location.href = '/user/'
})

$('#events-page').on('click', (e) => {
    e.preventDefault();
    window.location.href = '/events/'
})

$('#documents-page').on('click', (e) => {
    e.preventDefault();
    window.location.href = '/documents/'
})

$('#mentor-page-btn').on('click', (e) => {
    e.preventDefault();
    window.location.href = '/mentor/'
})

function showTraineesMentor(listTrainees) {
    for (let value of listTrainees) {
        document.querySelector('.trainees-list').innerHTML += `
             <div class="trainees-card">
                    <div class="info">
                        <h3>${value['first_name']} ${value['last_name']}</h3>
                        <div class="info_data">
                            <div class="data">
                                <h4>Телефон:</h4>
                                <p>${value['phone']}</p>
                            </div>
                            <div class="data">
                                <h4>Telegram:</h4>
                                <div class="list-telegram">
                                    <a target="_blank" href="https://t.me/${value['telegram'].replace('@', '')}">
                                        <svg class="icon-telegram" aria-hidden="true" focusable="false"
                                             data-prefix="fab" data-icon="telegram-plane"
                                             class="svg-inline--fa fa-telegram-plane fa-w-14" role="img"
                                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                            <path fill="currentColor"
                                                  d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z"></path>
                                        </svg>
                                    </a>
                                    <p>@dner56</p>
                                </div>
                            </div>
                            <div class="data">
                                <h4>Email:</h4>
                                <p>${value['email']}</p>
                            </div>
                        </div>

                        <div class="project">
                            <h3>Работа</h3>
                            <div class="project_data">
                                <div class="data">
                                    <h4>Цех:</h4>
                                    <p>${value['department']}</p>
                                </div>
                                <div class="data">
                                    <h4>Должность:</h4>
                                    <p>${value['position']}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="btn-list">
                        <a onclick="showModalEventList(${value['id']})" class="btn-model-cards btn green">Мероприятия</a>
                        <a onclick="showModalCreateEvent(${value['id']})" class="btn-model-create-event btn blue" href="#create-event-modal">Создать мероприятие</a>
                    </div>
                </div>`
    }
}

function showUserEvents(eventsData) {
    for (let value of eventsData) {
        const dateEvent = new Date(value['deadline'] * 1000);
        const dateEventString = dateEvent.toLocaleDateString('ru');
        const nowDate = new Date();
        const nowDateString = nowDate.toLocaleDateString('ru');


        let deadLine = Math.ceil(Math.abs(dateEvent.getTime() - nowDate.getTime()) / (1000 * 3600 * 24));

        if (deadLine < 10) {
            value['status'] = 'red';
        } else if (deadLine > 10 && deadLine < 14) {
            value['status'] = 'orange';
        } else {
            value['status'] = '';
        }

        if (value['completed']) {
            value['status'] = 'green'
        }

        document.querySelector('#events-list').innerHTML += `
             <div class="card ${value['status']}">
                    <svg class="check-${value['completed']}" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check"
                         role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor"
                              d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
                    </svg>
                    <h3 class="event-date">${dateEventString}</h3>
                    <p class="event-time">${value['name']}</p>
                    <p class="event-description">${value['description']}</p>
                    <span class="status-event green"></span>
                    <button onclick="userCompletedEvent(${value['id']})"  id="btn-complete" class="${value['completed']} btn-check btn green">Выполнил</button>
             </div>`
    }
}

function userCompletedEvent(eventId) {
    $.ajax({
        url: `/../api/event/${eventId}/`,
        type: 'PATCH',
        async: 'false',
        data: {'completed': 'true'},
        dataType: 'json',
        headers: {'Authorization': `Token ${localStorage.getItem('token')}`},
        success: function (result) {
            $.ajax({
                url: '/../api/event/',
                type: 'GET',
                async: 'false',
                dataType: 'json',
                headers: {'Authorization': `Token ${localStorage.getItem('token')}`},
                success: function (result) {
                    document.querySelector('#events-list').innerHTML = '';
                    showUserEvents(result);
                },
            })
        },
    })
}

function showUserCard(userData) {
    document.querySelector('#user-cars-page').innerHTML += `
                <div class="user-card">
            <div class="wrapper">
                <div class="left">
                    <svg class="user-photo" id="e59edb86-a3bc-4694-8aac-31e565ca5cfc" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="676" height="676" viewBox="0 0 676 676"><title>male_avatar</title><path d="M938,450a336.852,336.852,0,0,1-27.22,133.1L909.66,585.68A338.559,338.559,0,0,1,541.35,782.93q-3.045-.54-6.08-1.12a334.98111,334.98111,0,0,1-61.14-18.03q-4.815-1.935-9.56-4.01c-2.16-.94-4.32-1.91-6.46-2.91A338.41424,338.41424,0,0,1,262,450c0-186.67,151.33-338,338-338S938,263.33,938,450Z" transform="translate(-262 -112)" fill="#6c63ff"/><path d="M541.35,782.93q-3.045-.54-6.08-1.12c-1.32-38.31-5.85-116.94-21.30005-199.29C505.52,537.45,493.79,491.25,477.52,449.95a412.60387,412.60387,0,0,0-19.07-41.84c-16.44-31.05-36.38-57.19-60.56-74.9l3.56-4.86q30.165,22.11,54.22,62.08,7.215,11.97,13.86005,25.54,7.125,14.52,13.59,30.83,4.125,10.38,7.97,21.48,16.74,48.195,28.46,109.98,2.59506,13.65,4.94,27.97C536.6,680.2,540.25,748.59,541.35,782.93Z" transform="translate(-262 -112)" opacity="0.2"/><path d="M464.57,759.77c-2.16-.94-4.32-1.91-6.46-2.91-2.09-22.7-5.93-50.86-12.95-77.59A254.55666,254.55666,0,0,0,433.35,644.07c-8.01-18.75-18.38-34.69-31.79-44.52l3.56-4.85c14.04,10.28,24.87,26.53,33.24,45.54,9.43,21.42,15.72,46.35,19.91,70.17C461.38,728.1,463.34,745.19,464.57,759.77Z" transform="translate(-262 -112)" opacity="0.2"/><circle cx="102.26174" cy="190.98167" r="30.08857" opacity="0.2"/><circle cx="111.9514" cy="449.99083" r="30.08857" opacity="0.2"/><path d="M483.71449,353.52139c-6.38046,35.99732,7.70456,68.59225,7.70456,68.59225s24.42979-25.76825,30.81025-61.76557-7.70457-68.59225-7.70457-68.59225S490.09494,317.52407,483.71449,353.52139Z" transform="translate(-262 -112)" opacity="0.2"/><path d="M383.71766,438.97122c34.33494,12.555,68.83676,4.498,68.83676,4.498s-21.16612-28.41279-55.50106-40.96784-68.83675-4.498-68.83675-4.498S349.38272,426.41617,383.71766,438.97122Z" transform="translate(-262 -112)" opacity="0.2"/><path d="M377.89534,668.333c24.066,8.80008,48.28314,3.0594,48.28314,3.0594S411.37687,651.384,387.31086,642.5839s-48.28314-3.0594-48.28314-3.0594S353.82933,659.53292,377.89534,668.333Z" transform="translate(-262 -112)" opacity="0.2"/><circle cx="337.30608" cy="281.0788" r="131.77014" fill="#d0cde1"/><path d="M547.83337,493.96531s16.47127,78.23852,16.47127,86.47415,78.23852,45.296,78.23852,45.296L712.546,613.382,737.253,539.26129s-41.17817-61.76725-41.17817-86.47415Z" transform="translate(-262 -112)" fill="#d0cde1"/><path d="M910.78,583.1,909.66,585.68A338.559,338.559,0,0,1,541.35,782.93q-3.045-.54-6.08-1.12a334.98111,334.98111,0,0,1-61.14-18.03q-4.815-1.935-9.56-4.01c-2.16-.94-4.32-1.91-6.46-2.91a337.59273,337.59273,0,0,1-55.25-32.28l-15.62-45.31,8.78-6.69995,18.06-13.79,19.27-14.71,5.01-3.83,75.61-57.72,5.58-4.26,39.3-30,.01-.01s42.5,69.25,104.27,48.66,60.42-79.63,60.42-79.63Z" transform="translate(-262 -112)" fill="#2f2e41"/><path d="M485.03538,286.916s41.83653-90.64581,122.02321-69.72755,125.50958,52.29566,128.996,83.67306-1.74319,78.44348-1.74319,78.44348-8.716-64.498-64.498-50.55247-142.94147,3.48638-142.94147,3.48638L512.9264,457.74849s-15.6887-22.66145-33.12058-8.71594S429.25335,314.807,485.03538,286.916Z" transform="translate(-262 -112)" fill="#2f2e41"/><path d="M474.13,763.78q-4.815-1.935-9.56-4.01c-2.16-.94-4.32-1.91-6.46-2.91a338.835,338.835,0,0,1-87.59-58.7c9.19-12.52,16.72-18.89,16.72-18.89h61.77l9.26,31.14Z" transform="translate(-262 -112)" fill="#2f2e41"/><path d="M856.67,576.32l52.99,9.36A337.94434,337.94434,0,0,1,852.9,674.25Z" transform="translate(-262 -112)" fill="#2f2e41"/></svg>
                    <h4>${userData['first_name']} ${userData['last_name']}</h4>
                </div>
                <div class="right">

                    <div class="info">
                        <h3>Информация</h3>
                        <div class="info_data">
                            <div class="data">
                                <h4>Телефон:</h4>
                                <p>${userData['phone']}</p>
                            </div>
                            <div class="data">
                                <h4>Telegram:</h4>
                                <div class="list-telegram">
                                    <a target="_blank" href="https://t.me/${userData['telegram'].replace('@', '')}">
                                        <svg class="icon-telegram" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="telegram-plane" class="svg-inline--fa fa-telegram-plane fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z"></path></svg>
                                    </a>
                                    <p>${userData['telegram']}</p>
                                </div>
                            </div>
                            <div class="data">
                                <h4>Email:</h4>
                                <p>${userData['email']}</p>
                            </div>
                        </div>

                        <div class="project">
                            <h3>Работа</h3>
                            <div class="project_data">
                                <div class="data">
                                    <h4>Цех:</h4>
                                    <p>${userData['department']}</p>
                                </div>
                                <div class="data">
                                    <h4>Должность:</h4>
                                    <p>${userData['position']}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

//Выход
$('#logout').on('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('userStatus');
    localStorage.removeItem('userName');
    window.location.href = '/auth/'
})

function request(url, method, body, head) {
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

function isTrainee() {
    if (localStorage.getItem('userStatus') === 'trainee') {
        $('#mentor-page').css('display', 'none');
        $('#add-document-modal').css('display', 'none');
        $('#events-page').css('display', '');
        $('#question-page').css('display', '');
    } else {
        $('#mentor-page').css('display', '');
        $('#add-document-modal').css('display', '');
        $('#events-page').css('display', 'none');
        $('#question-page').css('display', 'none');

    }
}

function getUser() {
    return new Promise((resolve, reject) =>
        $.ajax({
            url: '/../api/auth/profile/',
            type: 'GET',
            async: 'false',
            dataType: 'json',
            headers: {'Authorization': `Token ${localStorage.getItem('token')}`},
            success: resolve,
            error: reject
        })
    );
}


function showTraineeEventList(eventList) {
    for (value of eventList) {

        let dateEvent = new Date(value['deadline'] * 1000);
        let dateEventString = dateEvent.toLocaleDateString('ru');
        let nowDate = new Date();
        let nowDateString = nowDate.toLocaleDateString('ru');

        let deadLine = Math.ceil(Math.abs(dateEvent.getTime() - nowDate.getTime()) / (1000 * 3600 * 24));

        if (deadLine < 10) {
            value['status'] = 'red';
        } else if (deadLine => 10 && deadLine <= 14) {
            value['status'] = 'orange';
        } else {
            value['status'] = '';
        }

        if (value['completed']) {
            value['status'] = 'green'
        }

        document.querySelector('#model-cards').innerHTML += `
             <div class="card ${value['status']}">
                    <svg class="check-${value['completed']}" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check"
                         role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor"
                              d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
                    </svg>
                        <h3 class="event-date">${dateEventString}</h3>
                        <p class="event-time">${value['name']}</p>
                        <p class="event-description">${value['description']}</p>
                        <span class="status-event green"></span>
                    </div>`
    }
}

//Modal
function showModalEventList(traineeId) {
    document.querySelector('#model-cards').innerHTML = '';
    $("#modal-event").modal({
        fadeDuration: 200
    });
    $.ajax({
        url: `http://127.0.0.1:8000/api/mentor/trainee/${traineeId}/events/`,
        type: 'GET',
        async: 'false',
        dataType: 'json',
        headers: {'Authorization': `Token ${localStorage.getItem('token')}`},
        success: function (result) {
            showTraineeEventList(result);
        },
    })
}

function showModalCreateEvent(traineeId) {
    $('#userId').attr('value', traineeId);
    $("#create-event-modal").modal({
        fadeDuration: 200
    });
}


$('#btn-send-event-model').click(() => {
    const userId = $('#userId').val();
    const nameEvent = $('.name-event').val();
    const dateEvent = document.querySelector('.data-event').valueAsNumber / 1000;
    const descriptionEvent = $('.descriptionEvent').val();

    $.ajax({
        url: '/../api/event/',
        type: 'POST',
        async: 'false',
        data: {
            "user": userId,
            "name": nameEvent,
            "deadline": dateEvent,
            "description": descriptionEvent,
            "completed": false
        },
        dataType: 'json',
        headers: {'Authorization': `Token ${localStorage.getItem('token')}`},
        success: function (result) {
            $('.name-event').val('');
            $('.data-event').val('')
            $('.descriptionEvent').val('');
        }
    })
})


function showModalCreateDocument() {
    $("#create-document-modal").modal({
        fadeDuration: 200
    });
}

function showModalLevel() {
    $("#list-ex-modal").modal({
        fadeDuration: 200
    });
}

$('#btn-send-document-model').click((e) => {
    e.preventDefault();
    let file = document.querySelector('#input-file-document').files[0];

    let formData = new FormData();
    formData.append('document', file)

    $.ajax({
        url: '/api/document/',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: {'Authorization': `Token ${localStorage.getItem('token')}`},
        success: function (result) {
        }
    })
})


$('#btn-search-document').click((e) => {
    e.preventDefault();
    let nameDocument = $('#name-document-search').val();

    $.ajax({
        url: `/api/document/${nameDocument}/search/`,
        type: 'GET',
        processData: false,
        contentType: false,
        headers: {'Authorization': `Token ${localStorage.getItem('token')}`},
        success: function (result) {
            document.querySelector('#search-document-lis').innerHTML = '';
            showDocuments(result);
        }
    })

})

function showDocuments(listDocuments) {
    for (let value of listDocuments) {
        document.querySelector('#search-document-lis').innerHTML += `
               <div class="document">
               <a target="_blank" href="${value['link']}">${value['name']}</a>
</div>
        `

    }
}
