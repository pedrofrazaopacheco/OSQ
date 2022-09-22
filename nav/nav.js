const linksList = ["/", "/add", "/learn"]
let head = document.getElementsByTagName("head")[0]

linksList.forEach((el) => {
    let PreLink = document.createElement("link")
    PreLink.rel = "prefetch"
    PreLink.href = el
    head.appendChild(PreLink)
})

document.querySelector(".PageContent").insertAdjacentHTML(
    "afterbegin",
    `
    <nav class="GoToLinks">
            <a href="/" class="NavLink NavButton">OSQ</a>
            <a href="/add" class="NavLink NavButton">Add an OSQ</a>
            <a href="/learn" class="NavLink NavButton">Learn an OSQ</a>
            <button onclick="toggleNightMode()" class="toggleNightModeButton NavButton">
                <img
                    src="/images/sun.svg"
                    class="sunSVG"
                />
                <img
                    src="/images/nightMode.svg"
                    class="MoonSVG MoonSVGTranslated"
                />
            </button>
    </nav>
`
)
// let OSQDataSettingsObj = {
//     colorMode: "light",
// }
// if (!localStorage.getItem("OSQDataSettings")) {
//     localStorage.setItem("OSQDataSettings", JSON.stringify(OSQDataSettingsObj))
// }

let sunSVGEl = document.querySelector(".sunSVG")
let MoonSVGEl = document.querySelector(".MoonSVG")
// const root = document.querySelector(":root")
// let currentColorMode = JSON.parse(
//     localStorage.getItem("OSQDataSettings")
// ).colorMode

function setInitialColorMode() {
    if (currentColorMode == "dark") {
        sunSVGEl.classList.toggle("sunSVGTranslated")
        MoonSVGEl.classList.toggle("MoonSVGTranslated")
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

function toggleNightMode() {
    sunSVGEl.classList.toggle("sunSVGTranslated")
    MoonSVGEl.classList.toggle("MoonSVGTranslated")
    if (OSQDataSettingsObj.colorMode == "light") {
        setDarkMode()
        OSQDataSettingsObj.colorMode = "dark"
        localStorage.setItem(
            "OSQDataSettings",
            JSON.stringify(OSQDataSettingsObj)
        )
    } else {
        setLightMode()
        OSQDataSettingsObj.colorMode = "light"
        localStorage.setItem(
            "OSQDataSettings",
            JSON.stringify(OSQDataSettingsObj)
        )
    }
}
