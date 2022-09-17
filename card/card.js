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

OSQObj.dataArray.forEach((element) => {
    if (element[2] == "D") {
        OSQCardList.insertAdjacentHTML(
            "beforeend",
            `<div class="OSQCard" style="z-index: ${zIndexCounter};" data-id=${dataIDCounter} onclick="toggleText(event)">
                <div class="Question front card">${element[0]}</div>
                <div class="Answer back card">${element[1]}</div>
            </div>`
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

// document
// .querySelectorAll(".Answer")
// .forEach((element) => element.classList.add("displayNone"))

function toggleText(event) {
    event.target.parentElement.classList.toggle("OSQCardRotated")
    // event.target.querySelector(".Question").classList.toggle("displayNone")
    // event.target.querySelector(".Answer").classList.toggle("displayNone")
}

function Next() {
    if (currentCard == dataArrayLength - 1) return 0
    OSQCardList.children[currentCard].classList.add("displayNone")
    OSQCardList.children[currentCard].classList.remove("SelectedOSQCard")
    currentCard++
    dataIDCounter = OSQCardList.children[currentCard].dataset.id
    OSQCardList.children[currentCard].classList.add("SelectedOSQCard")
}
function Previous() {
    if (currentCard == 0) return 0
    OSQCardList.children[currentCard].classList.remove("SelectedOSQCard")
    currentCard--
    OSQCardList.children[currentCard].classList.remove("displayNone")
    OSQCardList.children[currentCard].classList.add("SelectedOSQCard")
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
    element.classList.toggle("OSQCardRotated")
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

if (OSQCardList.children[0]) {
    OSQCardList.children[0].classList.add("SelectedOSQCard")
}
