const url = decodeURIComponent(document.location.href.split("?")[1])
const [ContinueFlag, OSQName] = url.split("=")
const QuestionsGroupDiv = document.querySelector(".QuestionsGroupDiv")
const OSQObj = JSON.parse(localStorage.getItem(OSQName))
let dataArrayClone = OSQObj.dataArray.slice()
let dataArrayCloneFiltered = OSQObj.dataArray
    .filter((el) => el[2] == "D")
    .slice()
let OpenAndCloseDivBoolean = false
let answersArray = [],
    temporaryAnswersArray = [],
    The4AnswersArray = []
let currentAnswer, currentAnswerIndex, randomNumber

function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// answersArray = dataArrayCloneFiltered.forEach((el) => el[1])

for (let i = 0; i < dataArrayCloneFiltered.length; i++) {
    answersArray[i] = dataArrayCloneFiltered[i][1]
}

for (let i = 0; i < dataArrayClone.length; i++) {
    The4AnswersArray = []
    currentAnswer = dataArrayClone[i][1]
    temporaryAnswersArray = answersArray.slice()
    if (temporaryAnswersArray.length <= 3)
        temporaryAnswersArray = OSQObj.dataArray.map((el) => el[1])
    currentAnswerIndex = temporaryAnswersArray.indexOf(currentAnswer)
    temporaryAnswersArray.splice(currentAnswerIndex, 1)

    for (let i = 0; i < 3; i++) {
        randomNumber = randomIntFromInterval(
            0,
            temporaryAnswersArray.length - 1
        )
        The4AnswersArray[i] = temporaryAnswersArray[randomNumber]
        temporaryAnswersArray.splice(randomNumber, 1)
    }
    randomNumber = randomIntFromInterval(0, 3)
    The4AnswersArray.splice(randomNumber, 0, currentAnswer)
    //Inserir answer em sitio random

    if (dataArrayClone[i][2] == "D") {
        QuestionsGroupDiv.insertAdjacentHTML(
            "beforeend",
            `
        <div class="QuestionDiv" data-id="${i}">
        <div class="QuestionInnerDiv">
        <div class="Question" >${dataArrayClone[i][0]}</div>
        <div
        class="AnswerDiv"
        onclick="ToogleQuestionDiv(this, event)"
        >
        <div class="AnswerWithImageDiv">
        <div class="Answer">Choose an option ...</div>
        <img
        src="/images/DropDownArrowOutline.svg"
        class="DropDownImage"
        alt=""
        />
        </div>
        <div class="AnswerOption">${The4AnswersArray[0]}</div>
        <div class="AnswerOption">${The4AnswersArray[1]}</div>
        <div class="AnswerOption">${The4AnswersArray[2]}</div>
        <div class="AnswerOption">${The4AnswersArray[3]}</div>
        </div>
        </div>
        </div>
                `
        )
    }
}
// })

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

function resetPage() {
    // document.location.reload()
    // location.reload()

    document.location.href =
        `/DropDown/?continue=` + encodeURIComponent(OSQName)
}

function LetUserCheckAnswers() {
    document.querySelector(".PressSpaceTitle").style.display = "block"
    document.querySelector(".CheckAnswersButton").remove()
    document.addEventListener("keyup", (event) => {
        if (event.code == "Space") {
            // localStorage.setItem(OSQName, JSON.stringify(OSQObj))
            resetPage()
        }
    })
}

function CheckAnswers() {
    let checkAnswersList = document.querySelectorAll(".QuestionDiv")
    let checkedAnswer, checkedDataId

    checkAnswersList.forEach((div) => {
        checkedDataId = div.dataset.id

        // checkedQuestion = div.querySelector(".Question").textContent
        checkedAnswer = div.querySelector(".Answer").textContent
        if (dataArrayClone[checkedDataId][1] != checkedAnswer) {
            div.classList.add("WrongAnswer")
            div.insertAdjacentHTML(
                "beforeend",
                `
            <div class="CorrectAnswerDiv">Correct Answer: ${dataArrayClone[checkedDataId][1]}</div>
            `
            )
            div.querySelector(".CorrectAnswerDiv").style.display = "block"
        } else {
            OSQObj.dataArray[checkedDataId][2] = "A"
        }
    })
    localStorage.setItem(OSQName, JSON.stringify(OSQObj))
    LetUserCheckAnswers()
}
