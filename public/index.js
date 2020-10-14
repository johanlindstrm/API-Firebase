// Local url API (with 'firebase serve')

const url = 'http://localhost:5001/fir-api-ce16b/us-central1/users/';

let users = [];
let selectedUser = {};

const tableSection = document.querySelector("#tableSection");
const editSection = document.querySelector("#editSection");
const userTable = document.querySelector("#userTable");
const createUserButton = document.querySelector("#createUserButton");
const deleteUserButton = document.querySelector("#deleteUserButton");
const backButton = document.querySelector("#backButton");
const userNameField = document.querySelector("#userNameField");
const userEmailField = document.querySelector("#userEmailField");


const initialize = () => {
    getUsers();
    createUserButton.addEventListener("click", createUser);
    deleteUserButton.addEventListener("click", deleteUser);
}
 
const showEditSection = (userId) => {
    if(!userId) {
        throw new Error("No id present.");
    }

    selectedUser = userId;
    tableSection.style.display = "none";
    editSection.style.display = "block";
}

const showTableSection = () => {
    tableSection.style.display = "block";
    editSection.style.display = "none";
}

const getUsers = async () => {
    try {
        const response = await fetch(url);
        
        if(response.ok) {
            users = await response.json();
            renderTable();
        }
        else {
            throw new Error(response.statusText);
        }
    }
    catch (err) {
        throw err;
    }
}

const createUser = async () => {

    const newUser = { name: userNameField.value, email: userEmailField.value };
    if(!newUser.name || !newUser.email) {
        console.log("TODO: Validering");
        return;
    }
    
    try {
        const response = await fetch(url, { method: "POST", body: JSON.stringify(newUser) });
        
        if(response.ok) {
            users.push(newUser);
            renderTable();
            clearForm();
            location.reload();
        }
        else {
            throw new Error(response.statusText);
        }
    } 
    catch (err) {
        throw err;
    }
}

const deleteUser = async () => {

    if(!selectedUser) {
        throw new Error("No user id found.");
    }
    
    try {
        const response = await fetch(url + selectedUser, { method: "DELETE" });
        
        if(response.ok) {
            // if everything went ok we filter out the user that was removed.
            users = users.filter(user => user.id !== selectedUser);
            renderTable();
            showTableSection();
        }
        else {
            throw new Error(response.statusText);
        }
    } 
    catch (err) {
        throw err;
    }
}

const renderTable = () => {
    let tableRow = "";

    users.forEach(user => {
        console.log(user);
        tableRow += 
        `<tr id=${user.id} onclick="showEditSection(this.id)">
            <td>${user.name}</td>
            <td>${user.email}</td>
        </tr>`;
    });

    userTable.innerHTML = tableRow;
}

const clearForm = () => {
    userNameField.value = '';
    userEmailField.value = '';
}

initialize();