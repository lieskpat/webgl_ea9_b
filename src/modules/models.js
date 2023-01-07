import { mat4 } from "gl-matrix";

const models = [];

function initModels() {
    createModel();
}

function createModel() {
    const model = {};
    //create and initialize Model-View-Matrix
    model.mvMatrix = mat4.create();
}

export { models };
