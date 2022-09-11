const url = decodeURIComponent(document.location.href.split("?")[1])
const [ContinueFlag, OSQName] = url.split("=")
const QuestionsGroupDiv = document.querySelector(".QuestionsGroupDiv")
const OSQObj = JSON.parse(localStorage.getItem(OSQName))

let dataID,
    childrenArray,
    inputList,
    count = 0

function resetAndContinue() {
    OSQObj.dataArray.forEach((element) => (element[2] = "D"))
    init()
}

function ContinueAsIs() {
    init()
}

if (ContinueFlag == "continue") ContinueAsIs()

function init() {
    document.querySelector(".checkAnswersButton").style.display = "block"
    document.querySelector(".ContinueButtons").style.display = "none"

    for (let i = 0; i < OSQObj.dataArray.length; i++) {
        if (OSQObj.dataArray[i][2] == "D") {
            QuestionsGroupDiv.insertAdjacentHTML(
                "beforeend",
                `
            <div class="QuestionDiv" data-id=${i}>
                <div class="Question">${OSQObj.dataArray[i][0]}</div>
                <input type="text" class="Answer" placeholder="Answer">
                <div class="CorrectAnswerDiv"></div>
            </div>`
            )
        }
    }

    if (QuestionsGroupDiv.children.length == 0) {
        OSQObj.dataArray.forEach((element) => (element[2] = "D"))
        localStorage.setItem(OSQName, JSON.stringify(OSQObj))
        resetPage()
    }

    inputList = Array.from(document.querySelectorAll(".Answer"))

    for (let i = 1; i != inputList.length; i++) {
        inputList[i - 1].addEventListener("keyup", (event) => {
            if (event.code == "Enter") {
                inputList[i].focus()
                count = i
            }
        })
        inputList[i - 1].addEventListener(
            "focus",
            () => {
                count = i - 1
                console.log(count)
            },
            true
        )
    }
    document.addEventListener("keydown", (event) => {
        if (event.code == "ArrowUp" && count > 0) {
            count -= 1
            inputList[count].focus()
        } else if (event.code == "ArrowDown" && count < inputList.length - 1) {
            count += 1
            inputList[count].focus()
        }
    })
}

function resetPage() {
    document.location.href = `/writeEx/?continue=` + encodeURIComponent(OSQName)
}

function LetUserCheckAnswers() {
    document.querySelector(".PressSpaceTitle").style.visibility = "visible"
    document.querySelector(".checkAnswersButton").remove()
    document.addEventListener("keyup", (event) => {
        if (event.code == "Space") {
            localStorage.setItem(OSQName, JSON.stringify(OSQObj))
            resetPage()
        }
    })
}

function checkAnswers() {
    childrenArray = Array.from(QuestionsGroupDiv.children)
    childrenArray.forEach((element) => {
        dataID = element.dataset.id
        if (element.children[1].value == OSQObj.dataArray[dataID][1]) {
            // element.classList.add("CorrectAnswer")
            OSQObj.dataArray[dataID][2] = "A"
        } else {
            element.children[2].textContent = `Correct Answer: ${OSQObj.dataArray[dataID][1]}`
            element.classList.add("WrongAnswer")
        }
    })
    LetUserCheckAnswers()
}
