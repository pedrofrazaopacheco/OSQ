let OSQDataSettingsObj = {
    colorMode: "light",
}
if (!localStorage.getItem("OSQDataSettings")) {
    localStorage.setItem("OSQDataSettings", JSON.stringify(OSQDataSettingsObj))
}

const darkModeObj = {
    backgroundColor: "#010409",
    textColor: "#ffffff",
    BorderColor: "#30363d",
    BoxBackgroundColor: "#0d1117",
    GrabGreen: "#00c700",
    ArrowBrightness: "0",
    ArrowInvert: "1",
}

const lightModeObj = {
    backgroundColor: "#ffffff",
    BoxBackgroundColor: "#fafafa",
    textColor: "#000000",
    BorderColor: "rgba(0, 0, 0, 0.1)",
    GrabGreen: "#00c700",
    ArrowBrightness: "1",
    ArrowInvert: "0",
}

// let sunSVGEl = document.querySelector(".sunSVG")
// let MoonSVGEl = document.querySelector(".MoonSVG")
const root = document.querySelector(":root")
let currentColorMode = JSON.parse(
    localStorage.getItem("OSQDataSettings")
).colorMode

function setInitialColorMode() {
    if (currentColorMode == "light") {
        setLightMode()
        OSQDataSettingsObj.colorMode = "light"
        localStorage.setItem(
            "OSQDataSettings",
            JSON.stringify(OSQDataSettingsObj)
        )
    } else {
        setDarkMode()
        OSQDataSettingsObj.colorMode = "dark"
        localStorage.setItem(
            "OSQDataSettings",
            JSON.stringify(OSQDataSettingsObj)
        )
    }
}

setInitialColorMode()

function setDarkMode() {
    for (const [key, value] of Object.entries(darkModeObj)) {
        root.style.setProperty(`--${key}`, `${value}`)
    }
}
function setLightMode() {
    for (const [key, value] of Object.entries(lightModeObj)) {
        root.style.setProperty(`--${key}`, `${value}`)
    }
}
