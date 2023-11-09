'use strict';

const canvas1 = document.getElementById('canvas1');
let submitTimer = null;

canvas1.onpointerdown = function(e) {
    clearTimeout(submitTimer);

    let firstTouch = true;
    draw(e);
    firstTouch = false;

    this.onpointermove = draw;

    this.onpointerup = () => {
        submitTimer = setTimeout(submit, 5e3);

        this.onpointermove = () => false;
        this.onpointerup = () => false;
    };

    function draw(e) {
        let canvasRect = canvas1.getBoundingClientRect();
        let ctx = canvas1.getContext('2d');
        let x = e.clientX - canvasRect.left;
        let y = e.clientY - canvasRect.top;

        if (firstTouch) ctx.moveTo(x, y)
        else ctx.lineTo(x, y);

        ctx.stroke();
    }
};

async function submit() {
    // Картинка 1 - Рисунок
    let image1Blob = await new Promise(resolve => canvas1.toBlob(resolve, 'image/png'));

    // Картинка 2 - Файл png
    /*let canvas2 = document.createElement('canvas');
    canvas2.width = image.clientWidth;
    canvas2.height = image.clientHeight;

    let context = canvas2.getContext('2d');
    context.drawImage(image, 0, 0);

    let image2Blob = await new Promise(resolve => canvas2.toBlob(resolve, 'image/png'));*/

    // Создание данных формы
    let formData = new FormData();
    formData.append("firstName", "John");
    formData.append("lastName", "Bauer");
    formData.set("image1", image1Blob, "drawing.png");
    //formData.set("image2", image2Blob, "wallpaper.png");

    // Генерация URL на https://webhook.site
    let url = 'https://webhook.site/bdb77cf3-0e57-4c05-a5a8-7b0d643b7124';

    // Отправление данные формы
    let response = await fetch(url, {
        method: 'POST',
        body: formData
    });

    // Получение ответа от сервера
    if (response.ok) {
        //console.log('Отправка рисунка прошла успешно');
        //alert('Отправка рисунка прошла успешно');
    } else {
        console.log('Ошибка HTTP заголовка:' + response.status);
    }
}
