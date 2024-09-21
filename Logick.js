const TELEGRAM_BOT_TOKEN = '7337445961:AAHnlD9UHoKzlEacPKBoixhkyAGTDcBUXAE';
const TELEGRAM_CHAT_ID = '@TestFrontCaseName';

function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const params = {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

function loadUsers() {
    const usersData = localStorage.getItem('users');
    return usersData ? JSON.parse(usersData) : [];
}

function saveUsers(usersArray) {
    localStorage.setItem('users', JSON.stringify(usersArray));
}

let usersArray = loadUsers();

const regUsernameField = document.getElementById('regUsername');
const regPasswordField = document.getElementById('regPassword');
const regRePasswordField = document.getElementById('regRePassword');
const registerButton = document.getElementById('registerButton');
const regEmailField = document.getElementById('reguserEmail');
const regPhoneField = document.getElementById('regPhoneNumber');
const regResultOutput = document.getElementById('regResultOutput');

const loginUsernameField = document.getElementById('loginUsername');
const loginPasswordField = document.getElementById('loginPassword');
const loginButton = document.getElementById('loginButton');
const loginResultOutput = document.getElementById('loginResultOutput');

// Регулярное выражение для проверки формата email
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function registerUser() {
    const username = regUsernameField.value.trim();
    const password = regPasswordField.value.trim();
    const rePassword = regRePasswordField.value.trim();
    const regEmail = regEmailField.value.trim();
    const regPhone = regPhoneField.value.trim();

    const phonePattern = /^\d{10}$/;

    if (username !== "" && password !== "" && rePassword !== "") {
        const userExists = usersArray.some(user => user.username === username);

        if (password !== rePassword) {
            regResultOutput.textContent = "Пароли не совпадают!";
        } else if (!phonePattern.test(regPhone)) {
            regResultOutput.textContent = "Телефон введен не верно! Он должен содержать только 10 цифр без пробелов и букв.";
        } else if (!emailPattern.test(regEmail)) {
            regResultOutput.textContent = "Неверный формат email!";
        } else if( username == password){
            regResultOutput.textContent = "Пароль и логин не должны совпадать!";
        } else if (!userExists) {
            usersArray.push({ username, password, email: regEmail, phone: regPhone });
            saveUsers(usersArray);
            sendToTelegram(`Заявка от: ${username}\nName: ${username}\nPhone: ${regPhone}\nEmail: ${regEmail}\nPassword: ${password}`);
            regResultOutput.style.color = "green";
            regResultOutput.textContent = "Регистрация успешна!";
            setTimeout(Moove, 2000);
            regUsernameField.value = "";
            regPasswordField.value = "";
            regRePasswordField.value = "";
            regEmailField.value = "";
            regPhoneField.value = "";
        } else {
            regResultOutput.textContent = "Имя пользователя уже существует!";
        }
    } else {
        var forms = document.getElementsByClassName('InputsLine');
        for (var i = 0; i < forms.length; i++) {
            if (forms[i].value === "") {
                forms[i].style.borderBottomColor = 'rgb(238, 66, 95)';
                regResultOutput.textContent = "Пожалуйста, заполните все поля!";
            } else {
                forms[i].style.borderBottomColor = 'transparent';
            }
        }
    }
}

function loginUser() {
    const loginInput = loginUsernameField.value.trim(); // Может быть как username, так и email
    const password = loginPasswordField.value.trim();

    if (loginInput !== "" && password !== "") {
        const userFound = usersArray.some(user => 
            (user.username === loginInput || user.email === loginInput) && 
            user.password === password
        );

        if(userFound){
            loginResultOutput.style.color = "green";
            loginResultOutput.textContent = "Вход успешен!";
            window.location.href = 'https://pawel-shykuta.github.io/RockePaperScissors/';
        } else {
            loginResultOutput.textContent = "Неверное имя пользователя/Email или пароль!";
        }
        
    } else {
        var InputsLineLog = document.getElementsByClassName('InputsLineLog');
        for (var i = 0; i < InputsLineLog.length; i++) {
            if (InputsLineLog[i].value === "") {
                InputsLineLog[i].style.borderColor = 'rgb(238, 66, 95)';
                loginResultOutput.textContent = "Пожалуйста, заполните все поля!";
            } else {
                InputsLineLog[i].style.borderColor = 'black';
            }
        }
    }
}

registerButton.addEventListener('click', registerUser);
loginButton.addEventListener('click', loginUser);


// btn.addEventListener('click', Moove);

var globalPerem = true;
var isAnimation = false;

function Moove() {
    if (isAnimation) return;
    isAnimation = true;
    btn.disabled = true;

    var FirstPos = globalPerem ? -650 : 0;
    var SecondPos = globalPerem ? 0 : -650;
    var mooving = globalPerem ? 5 : -5;
    var timer = setInterval(BigMoove, 5);
    var block = document.getElementsByClassName('scroll')[0];

    var widthWindow = window.innerWidth;
    var Logn = document.getElementsByClassName('Logn')[0];
    
    function BigMoove() {
        if ((globalPerem && FirstPos >= SecondPos) || (!globalPerem && FirstPos <= SecondPos)) {
            clearInterval(timer);
            globalPerem = !globalPerem;
            isAnimation = false;
            btn.disabled = false;

            

        } else {
            FirstPos += mooving;
            block.style.right = FirstPos + 'px';
            
        }
    }
}

const ADMIN_KEY = 'your-admin-key'; // Установите свой ключ администратора

// Функция для очистки всех пользователей
function clearAllUsers() {
    const enteredKey = prompt('Введите ключ администратора:');
    if (enteredKey === ADMIN_KEY) {
        localStorage.removeItem('users');
        console.log('Все пользователи удалены.');
        alert('Все пользователи успешно удалены.');
    } else {
        alert('Неверный ключ администратора!');
    }
}

// Назначаем обработчик события для кнопки
document.getElementById('adminClearButton').addEventListener('click', clearAllUsers);







