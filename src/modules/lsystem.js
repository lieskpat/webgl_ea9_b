const lsystem = {
    axiom: "F--F--F",
    rule: {
        orig: "F",
        subst: "F+F--F+F",
    },
};

function buildLsystem(loopCount) {
    let sentence = lsystem.axiom;
    for (let i = 0; i < loopCount; i++) {
        let result = "";
        for (let j = 0; j < sentence.length; j++) {
            let current = sentence.charAt(j);
            if (current === lsystem.rule.orig) {
                result += lsystem.rule.subst;
            } else {
                result += current;
            }
        }
        sentence = result;
        console.log(sentence);
    }
    return sentence;
}

const translation = {
    trans: [0.25, 0],
};

const rotation = {
    rot: [0, 0, 0, 0],
};

function turtle(sentence, gl, initObject, fn) {
    for (let i = 0; i < sentence.length; i++) {
        switch (sentence.charAt(i)) {
            case "F":
                //zeichne Linie
                //console.log(gl.getParameter(gl.ARRAY_BUFFER_BINDING));
                fn();
                //Translation der Linie
                console.log(
                    gl.getProgramParameter(
                        initObject.program,
                        gl.ACTIVE_UNIFORMS
                    )
                );
                console.log(gl.getActiveUniform(initObject.program, 0));
                gl.uniform4fv(
                    initObject.attribLocation.translationAttrib,
                    translation.trans
                );
                break;
            case "+":
                //Drehe Linie um 60 Grad
                //                gl.uniform4fv(attrib.rotation_Attrib, rotation.rot);
                //gl.drawArrays(gl.LINES, 0, 2);
                //fn();
                break;
            case "-":
                //Drehe Linie zurück
                break;
            default:
        }
    }
}

export { buildLsystem, turtle };
