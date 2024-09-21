import { toggleElemVisibility } from "./helper.js"

function initialiseOverlay() {
    const overlay = document.querySelector('#overlay')
    overlay.addEventListener('click', closeOverlay)

    function closeOverlay(e) {
        if (e.target.id == 'overlayBg') {
            for (let childElem of Array.from(overlay.children)) {
                if (childElem.id !== 'overlayBg') {
                    toggleElemVisibility(childElem, false)
                }
            }
            toggleElemVisibility(overlay, false)
        }
    }
}

export { initialiseOverlay }