'use strict';

const url = 'https://webhook.site/9c354858-d037-48e2-8e14-34f8ce6b59b3';
const canvas = document.getElementById('canvas');
let submitTimer = null;
let exit = false;

let formData = new FormData();
formData.set("firstName", "John");
formData.set("lastName", "Bauer");

canvas.onpointerdown = function(e) {
    if (submitTimer) clearTimeout(submitTimer);
    submitTimer = null;

    let firstTouch = true;
    draw(e);
    firstTouch = false;

    this.setPointerCapture(e.pointerId);

    this.onpointermove = draw;

    this.onpointerup = () => {
        createForm();

        submitTimer = setTimeout(() => {
            submitForm();
            submitTimer = null;
        }, 3e3);

        this.onpointermove = () => false;
        this.onpointerup = () => false;
    };

    function draw(e) {
        let canvasRect = canvas.getBoundingClientRect();
        let ctx = canvas.getContext('2d');
        let x = e.clientX - canvasRect.left;
        let y = e.clientY - canvasRect.top;

        if (firstTouch) ctx.moveTo(x, y)
        else ctx.lineTo(x, y);

        ctx.stroke();
    }
};

window.onunload = function() {
    if (submitTimer) {
        exit = true;
        submitForm();
    }
};

async function createForm() {
    let imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    formData.set("image", imageBlob, "drawing.png");
}

async function submitForm() {
    let options = {
        method: 'POST',
        body: formData
    };
    if (exit) options.keepalive = true;

    let response = await fetch(url, options);

    if (response.ok) {
        console.log('+');
    } else {
        console.error('Ошибка HTTP заголовка:' + response.status);
    }
}
