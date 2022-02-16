$(async function () {
    await getTableWithUsers();
    getNewUserForm();
    getDefaultModal();
    addNewUser();
})


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
    addNewUser: async (user) => await fetch('api/users', {method: 'POST', headers: userFetch.head, body: JSON.stringify(user)}),
    updateUser: async (user, id) => await fetch(`api/users/${id}`, {method: 'PUT', headers: userFetch.head, body: JSON.stringify(user)}),
    deleteUser: async (id) => await fetch(`api/users/${id}`, {method: 'DELETE', headers: userFetch.head})
}
async function getTableWithUsers() {
    const table = document.querySelector('#TableAllUsers tbody');

    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.firstName}</td>
                            <td>${user.lastName.slice(0, 15)}...</td>
                            <td>${user.age}</td> 
                            <td>${user.email}</td>
                            <td>${user.password}</td>
                            <td>${user.roles}</td>   
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-outline-secondary" 
                                data-toggle="modal" data-target="#someDefaultModal"></button>
                            </td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-outline-danger" 
                                data-toggle="modal" data-target="#someDefaultModal"></button>
                            </td>
                        </tr>
                )`;
                table.append(tableFilling);
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