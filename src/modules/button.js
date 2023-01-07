function getButton(id) {
    return function () {
        document
            .getElementById(id)
            .addEventlistener("click", (e) => console.log(e));
    };
}
