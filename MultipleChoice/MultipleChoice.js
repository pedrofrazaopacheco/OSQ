const url = decodeURIComponent(document.location.href.split("?")[1])
const [ContinueFlag, OSQName] = url.split("=")
// console.log(url.split("="))
// console.log(ContinueFlag)
// console.log(OSQName)
// const OSQName = decodeURIComponent(document.location.href.split("?")[1])

const OSQObj = JSON.parse(localStorage.getItem(OSQName))
const OSQCard = document.querySelector(".OSQCard")
const AnswerDivsList = document.querySelectorAll(".Answer")
const QuestionDiv = document.querySelector(".OSQCardQuestion")
const ProgressBar = document.querySelector("#progressBar")
let correctAnswerText

let count = 0,
    Question,
    Answer,
    randomArrAccess,
    QuestionIndex,
    options = [],
    subtractionArray = [],
    dataArrayClone,
    dataArrayCloneLength,
    supposedDataArrayCloneLength = 0,
    PBinterval = 0,
    rndInt,
    ProgressBarWidthPercentage

function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function updateProgressBar() {
    // console.log(progressBar.offsetWidth)
    ProgressBarWidthPercentage = Math.ceil(
        (progressBar.offsetWidth * 100) / 900 + PBinterval
    )
    if (ProgressBarWidthPercentage > 100) ProgressBarWidthPercentage = 100
    progressBar.style.width = ProgressBarWidthPercentage + "%"
}

function init() {
    document.querySelector(".MCScreen").style.display = "block"
    dataArrayClone = OSQObj.dataArray.filter((el) => el[2] == "D").slice()
    if (dataArrayClone.length == 0) {
        Reset()
        return 0
    }
    subtractionArray = OSQObj.dataArray.filter(
        (item) => !dataArrayClone.includes(item)
    )
    PBinterval = Math.ceil(100 / dataArrayClone.length)
    NextCard()
    document.querySelector(".ContinueButtons").style.display = "none"
    updateProgressBar()
}

function resetAndContinue() {
    OSQObj.dataArray.forEach((element) => (element[2] = "D"))
    init()
}

function ContinueAsIs() {
    init()
}

// const results = [0, 0, 0, 0]

let AnswerBank = []
let temporaryAnswerBank = []

function fillAnswersDivs(answersArray, correctAnswerIndex) {
    for (let i = 0; i < 4; i++) {
        if (i == correctAnswerIndex) {
            // AnswerDivsList[i].dataset.value = "true"
            AnswerDivsList[i].textContent = answersArray[i]
            correctAnswerText = answersArray[i]
        } else {
            // AnswerDivsList[i].dataset.value = "false"
            AnswerDivsList[i].textContent = answersArray[i]
        }
    }
}

function checkAnswer(event) {
    let answer = event.target.textContent == correctAnswerText

    // console.log(event.target.textContent == correctAnswerText)

    if (answer == true) {
        OSQCard.classList.add("RightAnswer")
        // OSQCard.style.boxShadow = "inset 0px 0px 0px 3px #00c700"
        // OSQCard.style.borderColor = "#00c700"
    } else {
        OSQCard.classList.add("WrongAnswer")
        // OSQCard.style.boxShadow = "inset 0px 0px 0px 3px #f00"
        // OSQCard.style.borderColor = "#f00"
    }

    document.querySelectorAll(".Answer").forEach((element) => {
        if (element.textContent == correctAnswerText) {
            element.classList.add("RightAnswer")
        } else {
            element.classList.add("WrongAnswer")
        }
    })

    setTimeout(() => {
        document.querySelectorAll(".Answer").forEach((element) => {
            element.classList.remove("RightAnswer")
            element.classList.remove("WrongAnswer")
        })
        OSQCard.classList.remove("RightAnswer")
        OSQCard.classList.remove("WrongAnswer")
        setTimeout(() => {
            if (answer == true) {
                correctAnswerFun()
            } else {
                wrongAnswerFun()
            }
        }, 500)
    }, 1500)
}

function correctAnswerFun() {
    QuestionIndex = OSQObj.dataArray.findIndex(
        (element) => element[0] == Question
    )
    OSQObj.dataArray[QuestionIndex][2] = "A"
    NextCard()
    updateProgressBar()
}

function wrongAnswerFun() {
    // count++
    NextCard()
    updateProgressBar()
}

function nextRound() {
    localStorage.setItem(OSQName, JSON.stringify(OSQObj))
    document.location.href =
        `/MultipleChoice/?continue=` + encodeURIComponent(OSQName)
}

function NextCard() {
    if (count == dataArrayClone.length) {
        nextRound()
        return 0
    }
    AnswerBank = []
    temporaryAnswerBank = []
    Question = dataArrayClone[count][0]
    Answer = dataArrayClone[count][1]
    if (dataArrayClone.length >= 4) {
        AnswerBank = dataArrayClone.filter((el) => el[0] != Question)
    } else {
        AnswerBank = dataArrayClone.filter((el) => el[0] != Question)
        supposedDataArrayCloneLength = dataArrayClone.length
        while (supposedDataArrayCloneLength < 4) {
            rndInt = randomIntFromInterval(0, subtractionArray.length - 1)
            AnswerBank.push(subtractionArray[rndInt])
            subtractionArray.splice(rndInt, 1)
            supposedDataArrayCloneLength++
        }
    }
    for (let i = 0; i < 3; i++) {
        randomArrAccess = Math.floor(Math.random() * AnswerBank.length)
        // console.log(AnswerBank)
        // console.log(AnswerBank[randomArrAccess])
        temporaryAnswerBank.push(AnswerBank[randomArrAccess][1])
        AnswerBank.splice(randomArrAccess, 1) //Deleting item from answers array to make sure its not repeated
    }
    rndInt = randomIntFromInterval(0, 3)
    for (let i = 0; i < 4; i++) {
        if (i == rndInt) options[i] = Answer
        else options[i] = temporaryAnswerBank.shift()
    }
    QuestionDiv.textContent = Question
    fillAnswersDivs(options, rndInt)
    if (dataArrayClone.length > 4) {
        dataArrayClone.shift()
    } else count++
    // console.log(dataArrayClone)
    // count++
}

if (ContinueFlag == "continue") ContinueAsIs()

// resetAndContinue()

function Reset() {
    OSQObj.dataArray.forEach((element) => (element[2] = "D"))
    localStorage.setItem(OSQName, JSON.stringify(OSQObj))
    document.location.href =
        `/MultipleChoice/?continue=` + encodeURIComponent(OSQName)
}
