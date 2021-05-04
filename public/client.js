const button = document.getElementById("use-button");
const addButton = document.getElementById("add-button")
const saveButton = document.getElementById("save-button")
const linkInput = document.getElementById("link-input")
const linkContainer = document.getElementById('link-list-container')
const usernameInput = document.getElementById("username-input")
const nameDisplayDiv = document.getElementById("display-name")
const usernameTag = document.getElementById("name-tag")
const statusTag = document.getElementById("status-tag")
const confirmTag = document.getElementById("confirm-tag")

var linkList = []
var listIndexCounter = 0

var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); 

button.onclick = async function () {
    const username = usernameInput.value
    
    const request = await fetch('http://localhost:5002/user', 
        {method: 'Post',
        headers: {
            'Content-Type': 'application/json'
                },
        body: JSON.stringify({
            'username': username,
        }),
    })
    
    const data = await request.json()
    const requestedUsername = data.username
    const requestedListedLinks = data.listedLinks
  
    if (requestedUsername == username) {
        const pText= `Name '${requestedUsername}' is in use ❌`
        usernameTag.innerText = pText
        clearScreen()
   } 
   if (username.length >= 3) {
        if (requestedUsername == 'NaN') {
            const pText = `Name '${username}' is not in use ✔️`
            usernameTag.innerText = pText
            addButton.style.display = 'block'
            linkInput.style.display = 'block'
            saveButton.style.display = 'block'

    }
    } else {
        usernameTag.innerText = `Name '${username}' is too short ❌`
    }
}

async function checkIfURL () {
    input = linkInput.value

    if (!pattern.test(input) || ! input.length == 0) {
        statusTag.innerText = 'Not an URL ❌'
    } 
    if (pattern.test(input)) {
        statusTag.innerText = 'URL added ✔️'
        
        if (linkList.includes(input))  {
            statusTag.innerText = 'URL already added ❌'
        }

        if (!linkList.includes(input)) {
            linkList.push(input)
            globalThis.linkList = linkList
            linkInput.value = ''
            renderLinksNonIterative(linkList)
            console.log(linkList)
        } 
    }
}

function renderLinksNonIterative(linkList) {
    var newDiv = document.createElement('div')
    newDiv.setAttribute('class', 'linked-list')

    var newATag = document.createElement('a')
    newATag.setAttribute('class', 'link-a')
    //newATag.setAttribute('href', `https://${linkList[listIndexCounter]}`)
    //Removed because with clicking the container it removes it, both is no good

    var newPTag = document.createElement('p')
    newPTag.setAttribute('class', 'link-content')
    newPTag.setAttribute('id', 'link-content')
    newPTag.innerText = linkList[listIndexCounter]
    
    newATag.appendChild(newPTag)
    newDiv.appendChild(newATag)
    //newDiv.appendChild(newPTag)
    linkContainer.appendChild(newDiv)

    listIndexCounter += 1
    console.log(linkList)
    newDiv.onclick = async function() {
        const selectedLink = newDiv.innerText
        newDiv.remove()

        for (var index = 0; index < linkList.length; index++) {
            if (linkList[index] == selectedLink) {
                linkList.splice(index, 1)
                listIndexCounter -= 1
                break
            }
        }
    }
}

async function sendData () {
    const username = usernameInput.value
    
    try {
    const request = await fetch('http://localhost:5002/save-user', 
        {method: 'Post',
        headers: {
            'Content-Type': 'application/json'
                },
        body: JSON.stringify({
            'username': username,
            'listedLinks': linkList 
        }),
    })
        confirmTag.innerText = 'Saving succeded ✔️'
        usernameTag.innerText = ''
        clearScreen()
        
        
    } 
    catch {
        confirmTag.innerText = 'Saving failed ❌'
    }
    
}


function clearScreen () {
    const allDivs = document.querySelectorAll('.linked-list')
        for (var index = 0; index < allDivs.length; index++) {
            allDivs[index].remove()
            globalThis.linkList = []
            listIndexCounter = 0
        }

    addButton.style.display = 'none'
    linkInput.style.display = 'none'
    saveButton.style.display = 'none'
    statusTag.innerText = ''
    usernameInput.value = ''
}