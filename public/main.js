// Lets try to make a connection to web socket server.

const socket = io()
const clientsTotal = document.getElementById('clients-total')

//we will enable message sending
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

//adding an event
messageForm.addEventListener('submit', (e) => {
    e.preventDefault() //prevents reloading of the page.
    sendMessage()
})

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total Clients: ${data}`
})

function sendMessage() {
    console.log(messageInput.value)
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date(),
    }
    socket.emit('message', data) //for sending the message using socket
    addMessageToUi(true,data)
    messageInput.value = ''
}

socket.on('chat-message', (data) => {
    console.log(data)
    addMessageToUi(false,data)
})

function addMessageToUi(isOwnMessage, data) {
    const element = `
            <li class="${isOwnMessage ? "message-right" : "message-left"}">
                <p class="message">
                    ${data.message}
                    <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
                </p>
            </li>
            `
    messageContainer.innerHTML += element
}