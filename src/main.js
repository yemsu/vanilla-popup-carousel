import './scss/main.scss'

const test = () => {
    const _img = document.createElement('img');
    _img.src = './img/temp_1_2.png';
    document.body.append(_img);
}

test();