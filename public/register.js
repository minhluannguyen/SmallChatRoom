let pass = document.getElementById('FirstPass');
let comfirmPass = document.getElementById('SecondPass');
let username = document.getElementById('Username');

comfirmPass.addEventListener("change", () => {
  
  if (comfirmPass.value !== pass.value) {
    document.getElementById('Caution').innerText = 'Comfirm password and password must be the same!!!';
  } else {
    document.getElementById('Caution').innerText = '';
  }
})

document.getElementsByClassName('login-form').addEventListener('submit', ()=> {
  if(username.value === '' || pass.value ==='' || comfirmPass ==='') {
    document.getElementById('Caution').innerText = 'You must fill all the info!';
  } else {
    document.getElementById('Caution').innerText = '';
  }
});