import { initRenderPipeline } from "./draw.js";

function rotationEvent(gl) {}

function translationEvent(gl) {}

function setListener(fn) {
    fn();
}

function keyEvents(gl) {
    document.addEventListener("keydown", function (e) {
        switch (e.key) {
            case "r":
                console.log(e);
                translationEvent(gl);
                break;
            case "l":
                console.log(e);
                translationEvent(gl);
                break;
            default:
        }
    });
}

export { setListener, keyEvents };
