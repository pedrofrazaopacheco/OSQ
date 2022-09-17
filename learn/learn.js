const OSQList = document.querySelector(".OSQList")
let LearnURL, currentDeleteItem

// console.log(...localStorage);
// const items = { ...localStorage };
// console.log(items);
// console.log(Object.keys({ ...localStorage }));

Object.keys({ ...localStorage }).forEach((listItem) =>
    OSQList.insertAdjacentHTML(
        "beforeend",
        `<div class="OSQItem" id="${listItem}">
    <p class="listItemText">
        ${listItem}
    </p>
    <div class="Functionbuttons">
        <button onclick="modify('${listItem}')" class="modifyButton">Modify</button>
        <button onclick="learnCards('${listItem}')" class="learnButton">Learn Cards</button>
        <button onclick="DropDown('${listItem}')" class="DropDownButton">DropDown</button>
        <button onclick="MultipleChoice('${listItem}')" class="MultipleChoice">MultipleChoice</button>
        <button onclick="DragAndDrop('${listItem}')" class="DragAndDropButton">Drag & Drop</button>
        <button onclick="WriteEx('${listItem}')" class="WriteExButton">WriteEx</button>
        <button onclick="showRemoveConfirmation('${listItem}', event)" class="deleteButton">delete</button>
    </div>
    </div>`
    )
)

function modify(listItem) {
    const modifyScreen = document.querySelector(".modifyScreen")
    const textarea = document.querySelector("textarea")
    const OSQName = document.querySelector(".OSQNameInput")
    const Separator = document.querySelector(".SeparatorInput")

    modifyScreen.style.display = "flex"
    document.querySelector(".blurDiv").style.display = "block"

    OSQName.value = listItem
    const dataObj = JSON.parse(localStorage.getItem(listItem))

    const separator = dataObj.separator
    Separator.value = separator

    let html = ""

    dataObj.dataArray.forEach(
        (element) => (html += element[0] + separator + element[1] + "\n")
    )
    html = html.slice(0, -1)
    // console.log("%cLogging html" + html, "background: #222; color: #bada55");
    textarea.value = html
}

function submit() {
    const modifyScreen = document.querySelector(".modifyScreen")
    const textarea = document.querySelector("textarea")
    const OSQName = document.querySelector(".OSQNameInput")
    const Separator = document.querySelector(".SeparatorInput")
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

    textarea.value = ""
    OSQName.value = ""
    Separator.value = ""
    console.log("Submit: " + { ...localStorage })
    modifyScreen.style.display = "none"
    document.querySelector(".blurDiv").style.display = "none"
}

function exit() {
    document.querySelector(".removeConfirmation").style.display = "none"
    document.querySelector(".modifyScreen").style.display = "none"
    document.querySelector(".blurDiv").style.display = "none"
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
    exit()
}

function showRemoveConfirmation(listItem, event) {
    document.querySelector(".blurDiv").style.display = "block"

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
