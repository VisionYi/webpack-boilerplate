import './index.scss';

const hello = (t = '') => {document.querySelector('.app').innerHTML = t};
hello('hello webpack 4 !!');
