$(async function () {
    await getTableWithUsers();
    await getNewUserForm();
   // getDefaultModal();
    await addNewUser();
})
let isUser = true;
let roleList = [
    {id: 1, role: "ROLE_USER"},
    {id: 2, role: "ROLE_ADMIN"}
]

console.log('привет')


const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    // bodyAdd : async function(user) {return {'method': 'POST', 'headers': this.head, 'body': user}},
    findAllUsers: async () => await fetch('api/admin/users'),
    findUserByUsername: async () => await fetch(`api/user`),
    findOneUser: async (id) => await fetch(`api/users/${id}`),
    addNewUser: async (user) => await fetch('api/admin/users', {method: 'POST', headers: userFetchService.head, body: JSON.stringify(user)}),
    updateUser: async (user, id) => await fetch(`api/users/${id}`, {method: 'PUT', headers: userFetch.head, body: JSON.stringify(user)}),
    deleteUser: async (id) => await fetch(`api/users/${id}`, {method: 'DELETE', headers: userFetch.head})
}
async function getTableWithUsers() {
    const table = document.querySelector('#TableAllUsers tbody');
    let temp = '';

    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                temp += `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.firstName}</td>
                            <td>${user.lastName.slice(0, 15)}...</td>
                            <td>${user.age}</td> 
                            <td>${user.email}</td>
                            <td>${user.roles.map(e => " " + e.name)}</td>   
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-outline-secondary" 
                                data-toggle="modal" data-target="#someDefaultModal"></button>
                            </td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-outline-danger" 
                                data-toggle="modal" data-target="#someDefaultModal"></button>
                            </td>
                        </tr>
                `;
                table.innerHTML = temp;
            })
        })

    // обрабатываем нажатие на любую из кнопок edit или delete
    // достаем из нее данные и отдаем модалке, которую к тому же открываем
    $("#mainTableWithUsers").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}


async function getNewUserForm() {
    let button = $(`#SliderNewUserForm`);
    let form = $(`#defaultSomeForm`)
    button.on('click', () => {
        if (form.attr("data-hidden") === "true") {
            form.attr('data-hidden', 'false');
            form.show();
            button.text('Hide panel');
        } else {
            form.attr('data-hidden', 'true');
            form.hide();
            button.text('Show panel');
        }
    })
}

async function addNewUser() {
    console.log("!!!!!")
    $('#addUser1').click(async () =>  {
        console.log("!!!!!")
        let addUserForm = $('#newUser1')
        let firstName = addUserForm.find('#addFirstName').val().trim();
        let lastName = addUserForm.find('#addLastName').val().trim();
        let age = addUserForm.find('#addAge').val().trim();
        let email = addUserForm.find('#addEmail').val().trim();
        let password = addUserForm.find('#addPassword').val().trim();
        let checkedRoles = () => {
            let array = []
            let options = document.querySelector('#addRoles').options
            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    array.push(roleList[i])
                }
            }
            return array;
        }
        let data = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: checkedRoles()
        }
        const response = await userFetchService.addNewUser(data);
        if (response.ok) {
            await getTableWithUsers();
            addUserForm.find('#addFirstName').val('');
            addUserForm.find('#addLastName').val('');
            addUserForm.find('#addAge').val('');
            addUserForm.find('#addEmail').val('');
            addUserForm.find('#addPassword').val('');
            addUserForm.find(checkedRoles()).val('');
            let alert = `<div class="alert alert-success alert-dismissible fade show col-12" role="alert" id="successMessage">
                         User create successful!
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            $('.nav-tabs a[href="#allUsersTable"]').tab('show');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            addUserForm.prepend(alert)
        }
    })



}

async function addTestUser() {
    console.log("!!!!!")

    $('#addTestUser').click(async () =>  {
        console.log("!!!!!")

        let firstName = "Pavel";
        let lastName = "Ivanov";
        let age = 10;
        let email = "1@1.ru";
        let password = 1;
        let roles = roleList;

        let data = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            roles: roles
        }
        await userFetchService.addNewUser(data);

    })}

async function getUser() {
    let temp = '';
    const table = document.querySelector('#tableUser tbody');
    await userFetchService.findUserByUsername()
        .then(res => res.json())
        .then(user => {
            temp = `
                <tr>
                   <td>${user.id}</td>
                            <td>${user.firstName}</td>
                            <td>${user.lastName.slice(0, 15)}...</td>
                            <td>${user.age}</td> 
                            <td>${user.email}</td>
                            <td>${user.roles.map(e => " " + e.name)}</td> 
                </tr>
            `;
            table.innerHTML = temp;

            $(function (){
                let role = ""
                for (let i = 0; i < user.roles.length; i++) {
                    role = user.roles[i].role
                    if (role === "ROLE_ADMIN") {
                        isUser = false;
                    }
                }
                if (isUser) {
                    $("#userTable").addClass("show active");
                    $("#userTab").addClass("show active");
                } else {
                    $("#allUsersTable").addClass("show active");
                    $("#adminTab").addClass("show active");
                }
            })
        })
}