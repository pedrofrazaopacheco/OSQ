const textarea = document.querySelector("textarea")
const OSQName = document.querySelector(".OSQNameInput")
const Separator = document.querySelector(".SeparatorInput")
const NameAlreadyExistsDiv = document.querySelector(".nameExistsWarning")

// Retrieving data:
// let text = localStorage.getItem("testJSON");
// let obj = JSON.parse(text);
// document.getElementById("demo").innerHTML = obj.name;

let OpenAndCloseDivBoolean = false
const groupsSet = new Set()
let currentDataSetGroup, prevDiv

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

prevDiv = Array.from(document.querySelector(".AnswerDiv").children)[1]
prevDiv.classList.add("SelectedOption")

// function submit() {
//     if (Object.keys({ ...localStorage }).includes(OSQName.value)) {
//         console.log("That name already exists! Sorry")
//         NameAlreadyExistsDiv.style.display = "inline"
//         return 1
//     }

//     const arrayOfLines = textarea.value.split("\n")
//     const SeparatorValue = Separator.value
//     const myObj = { dataArray: [], separator: SeparatorValue }

//     arrayOfLines.forEach((line) => {
//         line = line.split(SeparatorValue)
//         if (line[0] != "") {
//             myObj.dataArray.push([line[0], line[1], "D"])
//         }
//     })
//     const myJSON = JSON.stringify(myObj)
//     localStorage.setItem(OSQName.value, myJSON)

//     NameAlreadyExistsDiv.style.display = "none"

//     textarea.value = ""
//     OSQName.value = ""
//     Separator.value = ""
//     console.log(localStorage)

//     //   const items = { ...localStorage };
//     //   console.log(items);
// }

function submit() {
    const modifyScreen = document.querySelector(".modifyScreen")
    const textarea = document.querySelector("textarea")
    const OSQName = document.querySelector(".OSQNameInput")
    const Separator = document.querySelector("#SeparatorInputID")
    const GroupCantBeEmpty = document.querySelector(".GroupCantBeEmpty")
    const arrayOfLines = textarea.value.split("\n")
    const SeparatorValue = Separator.value
    let groupName

    if (Object.keys({ ...localStorage }).includes(OSQName.value)) {
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
    // console.log("Submit: " + { ...localStorage })
}

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
        prevDiv.classList.remove("SelectedOption")
        event.target.classList.add("SelectedOption")
        prevDiv = event.target
    }

    let currentAnswer = document.querySelector(".Answer").textContent

    if (
        event.target.textContent.trim() == "Set New Group" ||
        currentAnswer.trim() == "Set New Group"
    )
        SetNewGroup()
    else CloseNewGroup()
}

SetNewGroup()
