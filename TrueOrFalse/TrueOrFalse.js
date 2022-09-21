//Show the question
//Get an answer

//If AnswerList.length = 1, answer.list = Initial

const url = decodeURIComponent(document.location.href.split("?")[1])
const [ContinueFlag, OSQName] = url.split("=")
const QuestionsGroupDiv = document.querySelector(".QuestionsGroupDiv")
const OSQObj = JSON.parse(localStorage.getItem(OSQName))
let dataArrayClone = OSQObj.dataArray.slice()

let answer,
    answerIndex = 0,
    dataID,
    checkedAnswer,
    elementAnswer,
    answerAfterCheckDiv

//Q, A, A/D

function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function ResetDataArrayIfEmpty() {
    console.log(dataArrayClone.filter((el) => el[2] == "D").length)
    if (dataArrayClone.filter((el) => el[2] == "D").length == 0) {
        for (let i = 0; i < dataArrayClone.length; i++) {
            dataArrayClone[i][2] = "D"
        }
    }
    console.log(dataArrayClone)
}

ResetDataArrayIfEmpty()

for (let i = 0; i < dataArrayClone.length; i++) {
    if (dataArrayClone[i][2] == "D") {
        answerIndex = randomIntFromInterval(0, dataArrayClone.length - 1)
        if (randomIntFromInterval(0, 1) == 0) {
            answer = dataArrayClone[i][1]
        } else {
            while (answerIndex == i) {
                answerIndex = randomIntFromInterval(
                    0,
                    dataArrayClone.length - 1
                )
            }
            answer = dataArrayClone[answerIndex][1]
        }

        QuestionsGroupDiv.insertAdjacentHTML(
            "beforeend",
            `
        <div class="QuestionDiv" data-id=${i} data-answer="notAnswered">
            <div class="Question">${dataArrayClone[i][0]}</div>
            <div class="Answer">${answer}</div>
            <div class="buttonsDiv">
                <button class="True TFButton" onclick="trueAnswer(event)">True</button>
                <button class="False TFButton" onclick="falseAnswer(event)">False</button>
            </div>
            <div class="AnswerAfterCheckDiv">
            </div>
        </div>
        `
        )
    }
}

function trueAnswer(event) {
    event.target.parentElement.children[1].classList.remove("FalseSelected")
    event.target.classList.add("TrueSelected")
    event.target.parentElement.parentElement.dataset.answer = "true"
}

function falseAnswer(event) {
    event.target.parentElement.children[0].classList.remove("TrueSelected")
    event.target.classList.add("FalseSelected")
    event.target.parentElement.parentElement.dataset.answer = "false"
}

function LetUserCheckAnswers() {
    document.querySelector(".PressSpaceTitle").style.display = "block"
    document.querySelector(".CheckAnswersButton").remove()
    document.addEventListener("keyup", (event) => {
        if (event.code == "Space") {
            document.location.href =
                `/TrueOrFalse/?continue=` + encodeURIComponent(OSQName)
        }
    })
}

// dataID
// Answer
//

function CheckAnswers() {
    Array.from(QuestionsGroupDiv.children).forEach((el) => {
        dataID = el.dataset.id
        checkedAnswer = el.dataset.answer
        elementAnswer = el.querySelector(".Answer").textContent
        answerAfterCheckDiv = el.querySelector(".AnswerAfterCheckDiv")
        if (
            (dataArrayClone[dataID][1] == elementAnswer &&
                checkedAnswer == "true") ||
            (dataArrayClone[dataID][1] != elementAnswer &&
                checkedAnswer == "false")
        ) {
            OSQObj.dataArray[dataID][2] = "A"
        } else {
            console.log("Wrong Answer")
            el.classList.add("WrongQuestionDiv")

            answerAfterCheckDiv.textContent = `Correct Answer: ${dataArrayClone[dataID][1]}`
            answerAfterCheckDiv.classList.add("AnswerAfterCheckDivAnimated")
        }
        localStorage.setItem(OSQName, JSON.stringify(OSQObj))
    })
    LetUserCheckAnswers()
}
