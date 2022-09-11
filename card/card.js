const url = decodeURIComponent(document.location.href.split("?")[1])
const [SlideNumber, ...OSQName] = url.split("=")

const OSQObj = JSON.parse(localStorage.getItem(OSQName))
const OSQCardList = document.querySelector(".OSQCardList")
const AlreadyKnowDiv = document.querySelector(".AlreadyKnowDiv")

// console.log(OSQObj.dataArray);
let zIndexCounter = OSQObj.dataArray.length
let originalDataArrayLength = OSQObj.dataArray.length
let dataIDCounter = 0
let currentCard = 0

document.querySelector(".OSQName").textContent = `OSQ Name: ${OSQName}`

// Retrieving data:
// let text = localStorage.getItem(OSQName);
// let obj = JSON.parse(text);
// document.getElementById("demo").innerHTML = obj.name;

// const myObj = { dataArray: [], separator: SeparatorValue };
// const myJSON = JSON.stringify(myObj);
// localStorage.setItem(OSQName.value, myJSON);

OSQObj.dataArray.forEach((element) => {
    if (element[2] == "D") {
        OSQCardList.insertAdjacentHTML(
            "beforeend",
            `<div class="OSQCard" style="z-index: ${zIndexCounter};" data-id=${dataIDCounter} onclick="toggleText(event)"><p class="Question">${element[0]}</p><p class="Answer">${element[1]}</p></div>`
        )
    } else if (element[2] == "A") {
        AlreadyKnowDiv.insertAdjacentHTML(
            "beforeend",
            `
            <div class="AlreadyKnowCard" data-id=${dataIDCounter}>
                <div class="betweenDiv">
                <p class="AlreadyKnowCardQuestion">${OSQObj.dataArray[dataIDCounter][0]}</p>
                <p class="AlreadyKnowCardAnswer">${OSQObj.dataArray[dataIDCounter][1]}</p>
                </div>
                <button class="returnButton" onclick="returnToStack(${dataIDCounter})"><img src="/images/arrow.svg" class="returnImg"></button>
            </div>`
        )
    }
    zIndexCounter--
    dataIDCounter++
})

dataIDCounter = OSQCardList.children[0].dataset.id
let dataArrayLength = OSQCardList.children.length

document
    .querySelectorAll(".Answer")
    .forEach((element) => element.classList.add("displayNone"))

function toggleText(event) {
    event.target.querySelector(".Question").classList.toggle("displayNone")
    event.target.querySelector(".Answer").classList.toggle("displayNone")
}

function Next() {
    if (currentCard == dataArrayLength - 1) return 0
    OSQCardList.children[currentCard].classList.add("displayNone")
    currentCard++
    dataIDCounter = OSQCardList.children[currentCard].dataset.id
}
function Previous() {
    if (currentCard == 0) return 0
    currentCard--
    OSQCardList.children[currentCard].classList.remove("displayNone")
    dataIDCounter = OSQCardList.children[currentCard].dataset.id
}

function returnToStack(dataIDCounter) {
    OSQObj.dataArray[dataIDCounter][2] = "D"
    localStorage.setItem(OSQName, JSON.stringify(OSQObj))

    document.location.reload(true)
    // document.location.href =
    // `/card/?${currentCard}=` + encodeURIComponent(OSQName)
}

function AlreadyKnow() {
    OSQObj.dataArray[dataIDCounter][2] = "A"
    localStorage.setItem(OSQName, JSON.stringify(OSQObj))
    document.location.reload(true)
    // document.location.href =
    // `/card/?${currentCard}=` + encodeURIComponent(OSQName)
}

function currentCardFun() {
    console.log("DataID: " + dataIDCounter)
    console.log(currentCard)
}

function loopSlide(loopNumber) {
    for (let i = 0; i < loopNumber; i++) Next()
}

loopSlide(SlideNumber)

function toggleTextOnSpace(element) {
    // console.log(element);
    element.querySelector(".Question").classList.toggle("displayNone")
    element.querySelector(".Answer").classList.toggle("displayNone")
}

document.addEventListener("keyup", (event) => {
    if (event.code == "ArrowRight") Next()
    if (event.code == "ArrowLeft") Previous()
    if (event.code == "Space")
        toggleTextOnSpace(OSQCardList.children[currentCard])
})

function Reset() {
    OSQObj.dataArray.forEach((element) => (element[2] = "D"))
    localStorage.setItem(OSQName, JSON.stringify(OSQObj))
    document.location.reload(true)
    // document.location.href = `/card/?0=` + encodeURIComponent(OSQName)
}
