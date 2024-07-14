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
    if(messageInput.value === '') // incase of empty messages pop-up please type something.
        return
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
    clearFeedback()
    const element = `
            <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
                <p class="message">
                    ${data.message}
                    <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
                </p>
            </li>
            `
    messageContainer.innerHTML += element
    scrollToBottom()
}

//unable to scroll to bottom, lets fix this.
function scrollToBottom(){
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: `✍️${nameInput.value} is typing...`,
    })
})

messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: `✍️${nameInput.value} is typing...`,
    })
})

messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: ``,
    })
})

socket.on('feedback', (data) => {
    clearFeedback()
    const element = `
            <li class="message-feedback">
                <p class="feedback" id="feedback">
                    ${data.feedback}
                </p>
            </li>
            `
    messageContainer.innerHTML += element
})

function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element)
    })
}