const inputs = document.querySelectorAll('.input');

function focusFunc() {
    let parent = this.parentNode.parentNode;
    parent.classList.add('focus');
}

function blurFunc() {
    let parent = this.parentNode.parentNode;
    if (this.value === '') {
        parent.classList.remove('focus');
    }

}

inputs.forEach(input => {
    input.addEventListener('focus', focusFunc);
    input.addEventListener('blur', blurFunc);
});


//switch

const login = document.querySelector('.login');
const reg = document.querySelector('.registration');
const form = document.querySelector('#form-user');
const switchs = document.querySelector('.switch');

function tab2() {
    form.style.marginLeft = '-100%';
    login.style.background = ' #d9d9d9';
    login.style.color = '#000';
    reg.style.background = 'linear-gradient(45deg,#00d5fc,#046af6)';
    reg.style.color = '#fff';
}

function tab1() {
    form.style.marginLeft = '0';
    reg.style.background = ' #d9d9d9';
    reg.style.color = '#000'
    login.style.background = 'linear-gradient(45deg,#00d5fc,#046af6)';
    login.style.color = '#fff'
}
// document.getElementById('themeButton').onclick = toggleTheme;


// $('.btn-model-cards').click(()=>{
//     $("#modal-event").modal({
//         fadeDuration: 200
//     });
// })
//
// $('.btn-model-create-event').click(()=>{
//     $("#create-event-modal").modal({
//         fadeDuration: 200
//     });
//
// })
//
//
// $('#btn-send-event-model').click(()=> {
//     console.log('sdfsdf');
//     console.log($('.data-event').val());
//
// })