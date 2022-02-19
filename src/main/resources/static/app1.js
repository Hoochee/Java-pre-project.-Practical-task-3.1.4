let isAdmin = true;

$(async function () {
    await getUser();
    await infoUser();
    await tittle();
    await getUsers();
    await getNewUserForm();
    await getDefaultModal();
    await createUser();

})

const userFetch = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAllUsers: async () => await fetch('api/admin/users'),
    findUserByUsername: async () => await fetch(`api/user`),
    findOneUser: async (id) => await fetch(`api/admin/users/${id}`),
    addNewUser: async (user) => await fetch('api/admin/users', {
        method: 'POST',
        headers: userFetch.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user) => await fetch(`api/admin/users`, {
        method: 'PUT',
        headers: userFetch.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`api/admin/users/${id}`, {method: 'DELETE', headers: userFetch.head})
}

async function infoUser() {
    let temp = '';
    const info = document.querySelector('#info');
    await userFetch.findUserByUsername()
        .then(res => res.json())
        .then(user => {
            temp += `
             <span style="color: white">
               ${user.email} with roles <span>${user.roles.map(e => " " + e.name)}</span>
                </div>
            </span>
                </tr>
            `;
        });
    info.innerHTML = temp;
}

async function getUser() {
    let temp = '';
    const table = document.querySelector('#tableUser tbody');
    await userFetch.findUserByUsername()
        .then(res => res.json())
        .then(user => {
            temp = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(e => " " + e.name)}</td>
                </tr>
            `;
            table.innerHTML = temp;

            $(function () {
                let role = ""
                for (let i = 0; i < user.roles.length; i++) {
                    role = user.roles[i].name
                    if (role === "ROLE_ADMIN") {
                        isAdmin = false;
                    }
                }
                if (isAdmin) {
                    $("#userTable").addClass("show active");
                    $("#userTab").addClass("show active");
                } else {
                    $("#adminTable").addClass("show active");
                    $("#adminTab").addClass("show active");
                }
            })
        })
}

async function tittle() {
    let temp = ''
    const h1a1 = document.querySelector('#h1a1');
    if (isAdmin) {
        temp = `
            <h1 class="h1 a1" id="h1a1">User information page</h1>
            `;
        h1a1.innerHTML = temp;
    } else {
        temp = `
            <h1 class="h1 a1" id="h1a1">Admin panel</h1>
            `;
        h1a1.innerHTML = temp;
    }
}

async function getUsers() {
    let temp = '';
    const table = document.querySelector('#tableAllUsers tbody');
    await userFetch.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                temp += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(e => " " + e.name)}</td>
                    <td>
                        <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-info"
                            className data-toggle="modal" data-target="#editModal">Edit</button>
                    </td>
                    <td>
                        <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger"
                            className data-toggle="modal" data-target="#deleteModal">Delete</button>
                    </td>
                </tr>
               `;
            })
            table.innerHTML = temp;

        })

    $("#tableAllUsers").find('button').on('click', (event) => {
        let defaultModal = $('#defaultModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })

}

async function getNewUserForm() {
    let button = $(`#addUser`);
    let form = $(`#addForm`)
    button.on('click', () => {
        form.show()
    })
}

async function getDefaultModal() {
    $('#defaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

async function editUser(modal, id) {
    let oneUser = await userFetch.findOneUser(id);
    let user = oneUser.json();

    modal.find('.modal-title').html('Edit user');

    let editButton = `<button  class="btn btn-info" id="editButton">Edit</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);


    user.then(user => {
        let bodyForm = `
            <form class="form-group text-center" id="editUser">
               <div class="form-group">
                    <label for="editId" class="col-form-label">ID</label>
                    <input type="text" class="form-control username" id="editId" value="${user.id}" readonly>
               </div>

                <div class="form-group">
                    <label for="editFirstName" class="com-form-label">First Name</label>
                    <input type="text" class="form-control" id="editFirstName" value="${user.firstName}">
                </div>

                <div class="form-group">
                    <label for="editLastName" class="com-form-label">Last Name</label>
                    <input type="text" class="form-control" id="editLastName" value="${user.lastName}">
                </div>

                <div class="form-group">
                    <label for="editAge" class="com-form-label">Age</label>
                    <input type="number" class="form-control" id="editAge" value="${user.age}">
                </div>

                <div class="form-group">
                    <label for="editEmail" class="com-form-label">Email</label>
                    <input type="text" class="form-control" id="editEmail" value="${user.email}">
                </div>
                 <div class="form-group">
                    <label for="editPassword" class="com-form-label">Password</label>
                    <input type="password" class="form-control" id="editPassword" value="" required>
                </div>
                
                <div class="form-group">
                    <label for="editRoles" class="com-form-label">Role</label>
                    <select multiple id="editRoles" size="2" class="form-control" style="max-height: 100px">
                    <option value="2">USER</option>
                    <option value="1">ADMIN</option>
                    </select>
                </div>
            </form>
        `;

        modal.find('.modal-body').append(bodyForm);
    })

    $("#editButton").on('click', async () => {
        let id = modal.find("#editId").val().trim();
        let firstName = modal.find("#editFirstName").val().trim();
        let lastName = modal.find("#editLastName").val().trim();
        let age = modal.find("#editAge").val().trim();
        let email = modal.find("#editEmail").val().trim();
        let password = modal.find("#editPassword").val().trim();
        let array = $('#editRoles').val();
        let data = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            rolesIds: array
        }
        const response = await userFetch.updateUser(data, id);

        if (response.ok) {
            await getUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="messageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}

async function deleteUser(modal, id) {
    let oneUser = await userFetch.findOneUser(id);
    let user = oneUser.json();
    modal.find('.modal-title').html('Delete user');

    let deleteButton = `<button  class="btn btn-danger" id="deleteButton">Delete</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(deleteButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        let bodyForm = `
            <form class="form-group text-center" id="deleteUser">
               <div class="form-group">
                    <label for="id" class="col-form-label">ID</label>
                    <input type="text" class="form-control username" id="id" value="${user.id}" readonly>
               </div>

                <div class="form-group">
                    <label for="firstName" class="com-form-label">First Name</label>
                    <input type="text" class="form-control" id="firstName" value="${user.firstName}" readonly>
                </div>

                <div class="form-group">
                    <label for="lastName" class="com-form-label">Last Name</label>
                    <input type="text" class="form-control" id="lastName" value="${user.lastName}" readonly>
                </div>

                <div class="form-group">
                    <label for="age" class="com-form-label">Age</label>
                    <input type="number" class="form-control" id="age" value="${user.age}" readonly>
                    <div class="invalid-feedback">
                        Age cannot be empty
                    </div>
                </div>

                <div class="form-group">
                    <label for="email" class="com-form-label">Email</label>
                    <input type="text" class="form-control" id="email" value="${user.email}"  readonly>
                </div>
                
                 <div class="form-group">
                <label for="roles" class="com-form-label">Role:</label>
                <select id="roles" class="form-control select" size="2" name="roles" style="max-height: 100px" disabled>
                <option>${user.roles.map(role => " " + role.name)}</option>
            })}</option>
                </select>
            </div>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $("#deleteButton").on('click', async () => {
        const response = await userFetch.deleteUser(id);

        if (response.ok) {
            await getUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="messageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}

async function createUser() {
    $('#addUser').click(async () => {
        let addUserForm = $('#addForm')
        let firstName = addUserForm.find('#addFirstName').val().trim();
        let lastName = addUserForm.find('#addLastName').val().trim();
        let age = addUserForm.find('#addAge').val().trim();
        let email = addUserForm.find('#addEmail').val().trim();
        let password = addUserForm.find('#addPassword').val().trim();
        let array = $('#addRoles').val();
        let data = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            rolesIds: array
        }
        const response = await userFetch.addNewUser(data);
        if (response.ok) {
            await getUsers();
            $('.nav-tabs a[href="#adminTable"]').tab('show');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="messageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            addUserForm.prepend(alert);
        }
        addUserForm[0].reset();
    });
}