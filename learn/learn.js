const OSQList = document.querySelector(".OSQList")
let LearnURL, currentDeleteItem

// console.log(...localStorage);
// const items = { ...localStorage };
// console.log(items);
// console.log(Object.keys({ ...localStorage }));

let OpenAndCloseDivBoolean = false
const groupsSet = new Set()
let currentDataSetGroup, currentDeleteDiv, currentOSQNameForSubmit

Object.values({ ...localStorage }).forEach((listItem) => {
    // console.log(JSON.parse(listItem))
    currentDataSetGroup = JSON.parse(listItem).group
    if (currentDataSetGroup) groupsSet.add(JSON.parse(listItem).group)
})

groupsSet.forEach((el) => {
    document.querySelector(".AnswerDiv").insertAdjacentHTML(
        "beforeend",
        `
    <div class="AnswerOption">${el}</div>
    `
    )
})

function SetNewGroup() {
    document.querySelector(".SetNewGroup").style.display = "flex"
}

function CloseNewGroup() {
    document.querySelector(".SetNewGroup").style.display = "none"
}

function ToogleQuestionDiv(div, event) {
    OpenAndCloseDivBoolean = !OpenAndCloseDivBoolean
    let divChildren = Array.from(div.children).slice(1)

    div.querySelector(".DropDownImage").classList.toggle(
        "DropDownImageAnimated"
    )
    divChildren.forEach((child) => {
        child.classList.toggle("AnswerOptionAnimated")
    })
    if (Array.from(event.target.classList).includes("AnswerOption")) {
        div.querySelector(".Answer").textContent = event.target.textContent
    }

    let currentAnswer = document.querySelector(".Answer").textContent

    if (
        event.target.textContent.trim() == "Set New Group" ||
        currentAnswer.trim() == "Set New Group"
    )
        SetNewGroup()
    else CloseNewGroup()
}

// console.log(groupsSet)

groupsSet.forEach((group) => {
    OSQList.insertAdjacentHTML("beforeend", `<h1>${group}</h1>`)

    for (const [key, value] of Object.entries({ ...localStorage })) {
        if (key != "OSQDataSettings" && JSON.parse(value).group == group) {
            OSQList.insertAdjacentHTML(
                "beforeend",
                `<div class="OSQItem" id="${key}">
    <p class="keyText">
    ${key}
    </p>
    <div class="Functionbuttons">
        <button onclick="modify('${key}')" class="modifyButton learnButton">Modify</button>
        <button onclick="learnCards('${key}')" class="learnButton learnButton">Learn Cards</button>
        <button onclick="DropDown('${key}')" class="DropDownButton learnButton">DropDown</button>
        <button onclick="MultipleChoice('${key}')" class="MultipleChoice learnButton">MultipleChoice</button>
        <button onclick="DragAndDrop('${key}')" class="DragAndDropButton learnButton">Drag & Drop</button>
        <button onclick="TrueOrFalse('${key}')" class="TrueOrFalseButton learnButton">TrueOrFalse</button>
        <button onclick="WriteEx('${key}')" class="WriteExButton learnButton">WriteEx</button>
        <button onclick="showRemoveConfirmation('${key}', event)" class="deleteButton learnButton">delete</button>
        </div>
        </div>`
            )
        }
        // console.log(`${key}: ${value}`);
    }
})

currentDeleteDiv = document.querySelector(".OSQItem")

function modify(listItem) {
    const modifyScreen = document.querySelector(".modifyScreen")
    const textarea = document.querySelector("textarea")
    const OSQName = document.querySelector(".OSQNameInput")
    const Separator = document.querySelector("#SeparatorInputID")
    // const setNewGroupInput = document.querySelector(".SetNewGroupInput")
    const AnswerGroup = document.querySelector(".Answer")
    currentOSQNameForSubmit = listItem

    modifyScreen.style.display = "flex"
    document.querySelector(".blurDiv").style.display = "block"
    // document.querySelector(".blurDiv").classList.add("BlurDivShow")

    // console.log(OSQName, listItem)

    OSQName.value = listItem
    const dataObj = JSON.parse(localStorage.getItem(listItem))
    // console.log(OSQName.value)

    if (dataObj.group) {
        CloseNewGroup()
        AnswerGroup.textContent = dataObj.group
    } else {
        AnswerGroup.textContent = "Set New Group"
        SetNewGroup()
        // setNewGroupInput.value = dataObj.group || ""
    }

    const separator = dataObj.separator
    Separator.value = separator

    let html = ""

    // console.log(dataObj.dataArray)

    dataObj.dataArray.forEach(
        (element) => (html += element[0] + separator + element[1] + "\n")
    )
    html = html.slice(0, -1)
    // console.log("%cLogging html" + html, "background: #222; color: #bada55");
    textarea.value = html
}

function submit() {
    const NameAlreadyExistsDiv = document.querySelector(".nameExistsWarning")
    const modifyScreen = document.querySelector(".modifyScreen")
    const textarea = document.querySelector("textarea")
    const OSQName = document.querySelector(".OSQNameInput")
    const Separator = document.querySelector("#SeparatorInputID")
    const GroupCantBeEmpty = document.querySelector(".GroupCantBeEmpty")
    const arrayOfLines = textarea.value.split("\n")
    const SeparatorValue = Separator.value
    let groupName

    // console.log(currentOSQNameForSubmit)
    // console.log(OSQName.value)
    // console.log(currentOSQNameForSubmit != OSQName.value)

    if (
        Object.keys({ ...localStorage }).includes(OSQName.value) &&
        currentOSQNameForSubmit != OSQName.value
    ) {
        // console.log("That name already exists! Sorry")
        NameAlreadyExistsDiv.style.display = "inline"
        return 1
    } else {
        NameAlreadyExistsDiv.style.display = "none"
    }
    if (
        document.querySelector(".SetNewGroupInput").value == "" &&
        document.querySelector(".SetNewGroup").style.display != "none"
    ) {
        GroupCantBeEmpty.style.display = "inline"
        return 1
    } else {
        GroupCantBeEmpty.style.display = "none"
    }
    if (textarea.value == "") {
        document.querySelector(".EmptyTextArea").style.display = "inline"
        return 1
    } else {
        document.querySelector(".EmptyTextArea").style.display = "none"
    }

    if (
        modifyScreen.querySelector(".Answer").textContent.trim() ==
        "Set New Group"
    ) {
        groupName = document.querySelector(".SetNewGroupInput").value
    } else {
        groupName = document.querySelector(".Answer").textContent
    }

    // groupsSet.add(groupName)

    const myObj = {
        dataArray: [],
        separator: SeparatorValue,
        group: groupName,
    }

    arrayOfLines.forEach((line) => {
        line = line.split(SeparatorValue)
        if (line[0] != "") {
            myObj.dataArray.push([line[0], line[1], "D"])
        }
    })
    const myJSON = JSON.stringify(myObj)
    localStorage.setItem(OSQName.value, myJSON)

    textarea.value = ""
    OSQName.value = ""
    Separator.value = ""
    document.querySelector(".SetNewGroupInput").value = ""
    // console.log(modifyScreen)
    exit()
    location.reload("true")
    // console.log("Submit: " + { ...localStorage })
}

function exit() {
    document.querySelector(".removeConfirmation").style.display = "none"
    document.querySelector(".modifyScreen").style.display = "none"
    document.querySelector(".blurDiv").style.display = "none"

    document.querySelectorAll(".Warning").forEach((el) => {
        el.style.display = "none"
    })

    // console.log(OpenAndCloseDivBoolean)
    if (OpenAndCloseDivBoolean) {
        let divChildren = Array.from(
            document.querySelector(".AnswerDiv").children
        ).slice(1)
        document
            .querySelector(".AnswerDiv")
            .querySelector(".DropDownImage")
            .classList.remove("DropDownImageAnimated")
        divChildren.forEach((child) => {
            child.classList.remove("AnswerOptionAnimated")
        })
        OpenAndCloseDivBoolean = !OpenAndCloseDivBoolean
    }
    currentDeleteDiv.classList.remove("DeletedSelected")
    // console.log(OpenAndCloseDivBoolean)
    // CloseNewGroup()
    // document.querySelector(".blurDiv").classList.remove("BlurDivShow")
}

function learnCards(listItem) {
    // LearnURL = listItem;
    // let url = `/card/?0=` + encodeURIComponent(LearnURL);
    document.location.href = `/card/?continue=` + encodeURIComponent(listItem)
}

function MultipleChoice(listItem) {
    document.location.href =
        `/MultipleChoice/?continue=` + encodeURIComponent(listItem)
}

document.addEventListener("keyup", function (event) {
    if (event.code == "Escape") {
        exit()
    }
})

function remove() {
    // console.log(currentDeleteItem)
    currentDeleteItem.remove()
    // console.log(currentDeleteItem.id)
    localStorage.removeItem(currentDeleteItem.id)
    // exit()
    location.reload("true")
}

function showRemoveConfirmation(listItem, event) {
    document.querySelector(".blurDiv").style.display = "block"
    currentDeleteDiv = event.target.parentElement.parentElement
    currentDeleteDiv.classList.add("DeletedSelected")

    // document.querySelector(".blurDiv").classList.add("BlurDivShow")
    currentDeleteItem = event.target.parentElement.parentElement
    document.querySelector(".removeConfirmation").style.display = "block"
}

function WriteEx(listItem) {
    document.location.href =
        `/writeEx/?continue=` + encodeURIComponent(listItem)
}

function DragAndDrop(listItem) {
    document.location.href =
        `/DragAndDrop/?continue=` + encodeURIComponent(listItem)
}

function DropDown(listItem) {
    document.location.href =
        `/DropDown/?continue=` + encodeURIComponent(listItem)
}

function TrueOrFalse(listItem) {
    document.location.href =
        `/TrueOrFalse/?continue=` + encodeURIComponent(listItem)
}
