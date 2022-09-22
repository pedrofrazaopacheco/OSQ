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

Object.keys({ ...localStorage }).forEach((listItem) => {
    groupsSet.add(listItem)
})

groupsSet.forEach((el) => {
    document.querySelector(".AnswerDiv").insertAdjacentHTML(
        "beforeend",
        `
    <div class="AnswerOption">${el}</div>
    `
    )
})

function submit() {
    if (Object.keys({ ...localStorage }).includes(OSQName.value)) {
        console.log("That name already exists! Sorry")
        NameAlreadyExistsDiv.style.display = "inline"
        return 1
    }

    const arrayOfLines = textarea.value.split("\n")
    const SeparatorValue = Separator.value
    const myObj = { dataArray: [], separator: SeparatorValue }

    arrayOfLines.forEach((line) => {
        line = line.split(SeparatorValue)
        if (line[0] != "") {
            myObj.dataArray.push([line[0], line[1], "D"])
        }
    })
    const myJSON = JSON.stringify(myObj)
    localStorage.setItem(OSQName.value, myJSON)

    NameAlreadyExistsDiv.style.display = "none"

    textarea.value = ""
    OSQName.value = ""
    Separator.value = ""
    console.log(localStorage)

    //   const items = { ...localStorage };
    //   console.log(items);
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
}
