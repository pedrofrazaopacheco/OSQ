let draggedEl
let draggableElementsList
let dropZoneElementsList
const url = decodeURIComponent(document.location.href.split("?")[1])
const [ContinueFlag, OSQName] = url.split("=")
const OSQObj = JSON.parse(localStorage.getItem(OSQName))
const containerParQuestionsDiv = document.querySelector(
    ".containerParQuestions"
)
const containerParAnswersDiv = document.querySelector(".containerParAnswers")
let ArraycontainerParQuestionsDiv

let answersList = []

if (ContinueFlag == "continue") ContinueAsIs()

function resetAndContinue() {
    OSQObj.dataArray.forEach((element) => (element[2] = "D"))
    init()
}

function ContinueAsIs() {
    if (OSQObj.dataArray.filter((element) => element[2] == "D").length == 0) {
        resetAndContinue()
        return 0
    }
    init()
}

function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function FillPageContent() {
    for (let i = 0; i < OSQObj.dataArray.length; i++) {
        if (OSQObj.dataArray[i][2] == "D") {
            // console.log(element)
            containerParQuestionsDiv.insertAdjacentHTML(
                "beforeend",
                `<div class="Qrow" data-id=${i}>
                <div class="Question">${OSQObj.dataArray[i][0]}</div>
                <div class="box AnswerDropZone draggableEl"></div>
                <div class="AnswerAfterCheckDiv"></div>
                </div>
                `
            )
            answersList.push(
                `<div draggable="true" class="AnswerDiv draggableEl">${OSQObj.dataArray[i][1]}</div>`
            )
            // containerParAnswersDiv.insertAdjacentHTML(
            //     "beforeend",
            //     `
            //         <div draggable="true" class="AnswerDiv draggableEl">${OSQObj.dataArray[i][1]}</div>
            //         `
            // )
        }
    }
    for (let i = answersList.length - 1; i >= 0; i--) {
        let randomNumber = randomIntFromInterval(0, i)
        console.log(randomNumber)
        console.log(answersList)
        console.log(answersList[randomNumber])
        console.log("")
        containerParAnswersDiv.insertAdjacentHTML(
            "beforeend",
            answersList[randomNumber]
        )
        answersList.splice(randomNumber, 1)
    }
}

function AddOpacityFunctionToDraggableElements() {
    draggableElementsList.forEach((element) => {
        element.addEventListener("dragstart", (event) => {
            element.style.opacity = "0.4"
            draggedEl = element
        })
        element.addEventListener("dragend", (event) => {
            element.style.opacity = "1"
            draggedEl = null
        })
    })
}

function AddOpacityFunctionSingleElement(element) {
    console.log(element)
    element.addEventListener("dragstart", (event) => {
        element.style.opacity = "0.4"
        draggedEl = element
    })
    element.addEventListener("dragend", (event) => {
        element.style.opacity = "1"
        draggedEl = null
    })
}

function AddDropZoneFunctionality() {
    dropZoneElementsList.forEach((element) => {
        element.addEventListener("dragover", (event) => {
            event.preventDefault()
            element.classList.add("DragOn")
        })
        element.addEventListener("dragleave", (event) => {
            event.preventDefault()
            element.classList.remove("DragOn")
        })
        element.addEventListener("drop", (event) => {
            event.preventDefault()
            // move dragged element to the selected drop target
            //If there is text in the dropzone, and there is a drop, insert the element in the answersDiv
            if (Array.from(draggedEl.classList).includes("AnswerDropZone")) {
                draggedEl.setAttribute("draggable", false)
            }

            if (element.textContent != "") {
                containerParAnswersDiv.insertAdjacentHTML(
                    "beforeend",
                    `
                    <div draggable="true" class="AnswerDiv draggableEl">${element.textContent}</div>
                    `
                )
                AddOpacityFunctionSingleElement(
                    containerParAnswersDiv.children[
                        Array.from(containerParAnswersDiv.children).length - 1
                    ]
                )
            }

            element.classList.remove("DragOn")
            element.textContent = draggedEl.textContent
            element.setAttribute("draggable", true)
            draggedEl.textContent = ""

            //AnswerDiv is the answers Below
            //If the dragged element is an answer, remove it
            if (Array.from(draggedEl.classList).includes("AnswerDiv"))
                draggedEl.remove()
        })
    })
}

function AddAnswersContainerFuncionality() {
    containerParAnswersDiv.addEventListener("dragover", (event) => {
        event.preventDefault()
        // console.log(draggedEl)
        if (Array.from(draggedEl.classList).includes("AnswerDropZone")) {
            containerParAnswersDiv.classList.add("containerParAnswersDivOver")
        }
    })
    containerParAnswersDiv.addEventListener("dragleave", (event) => {
        event.preventDefault()
        if (Array.from(draggedEl.classList).includes("AnswerDropZone")) {
            containerParAnswersDiv.classList.remove(
                "containerParAnswersDivOver"
            )
        }
    })

    containerParAnswersDiv.addEventListener("drop", (event) => {
        event.preventDefault()
        //Check if the drop classlist is correct
        if (Array.from(draggedEl.classList).includes("AnswerDropZone")) {
            containerParAnswersDiv.insertAdjacentHTML(
                "beforeend",
                `
                <div draggable="true" class="AnswerDiv draggableEl">${draggedEl.textContent}</div>
            `
            )
            AddOpacityFunctionSingleElement(
                containerParAnswersDiv.children[
                    Array.from(containerParAnswersDiv.children).length - 1
                ]
            )

            containerParAnswersDiv.classList.remove(
                "containerParAnswersDivOver"
            )
            draggedEl.setAttribute("draggable", false)
            draggedEl.textContent = ""
        }
    })
}

function init() {
    document.querySelector(".ContinueButtons").remove()
    document.querySelector(".CheckAnswersButton").style.visibility = "visible"
    FillPageContent()

    draggableElementsList = document.querySelectorAll(".draggableEl")
    dropZoneElementsList = document.querySelectorAll(".AnswerDropZone")

    AddOpacityFunctionToDraggableElements()
    AddDropZoneFunctionality()
    AddAnswersContainerFuncionality()
}

function LetUserCheckAnswers() {
    document.querySelector(".PressSpaceTitle").style.display = "block"
    document.querySelector(".CheckAnswersButton").remove()
    document.addEventListener("keyup", (event) => {
        if (event.code == "Space") {
            document.location.href =
                `/DragAndDrop/?continue=` + encodeURIComponent(OSQName)
        }
    })
}

function CheckAnswers() {
    ArraycontainerParQuestionsDiv = Array.from(
        containerParQuestionsDiv.children
    )
    ArraycontainerParQuestionsDiv.forEach((element) => {
        console.log(OSQObj.dataArray[element.dataset.id])
        console.log(element.children[1].textContent)
        if (
            OSQObj.dataArray[element.dataset.id][1] ==
            element.children[1].textContent
        ) {
            OSQObj.dataArray[element.dataset.id][2] = "A"
        } else {
            element.classList.add("WrongAnswer")
            element.children[2].style.display = "block"
            element.children[2].textContent =
                "Correct Answer: " + OSQObj.dataArray[element.dataset.id][1]
        }
    })
    localStorage.setItem(OSQName, JSON.stringify(OSQObj))
    LetUserCheckAnswers()
    console.log(OSQObj)
}
