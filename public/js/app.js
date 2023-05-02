const menu = document.querySelectorAll('.item-menu');
const h1 = document.querySelector('h1');
const contain = document.querySelector('.contain');
const currentDate = document.querySelector('.current-date p');

class ListOfBooks {}

const listofbooks = new ListOfBooks();

/* eslint-disable no-unused-vars */
const menuActive = (menu, active) => {
  for (let i = 0; i < menu.length; i += 1) {
    menu[i].classList.remove('active');
  }
  active.classList.add('active');
};

const generateAddForm = () => {
  const parent = document.createElement('form');
  parent.setAttribute('action', '');
  parent.setAttribute('method', 'POST');
  parent.setAttribute('onsubmit', 'return validateForm()');
  parent.setAttribute('id', 'add_book');
  const l1 = document.createElement('fieldset');
  l1.innerHTML = '<legend><label for="title">Title</label></legend>';
  parent.appendChild(l1);
  // input title
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('name', 'title');
  input.setAttribute('id', 'title');
  input.setAttribute('value', 'valeur 1');
  input.setAttribute('placeholder', 'Write the title');
  l1.appendChild(input);
  const l2 = document.createElement('fieldset');
  l2.innerHTML = '<legend><label for="author">Author</label></legend>';
  parent.appendChild(l2);
  // input author
  const input2 = document.createElement('input');
  input2.setAttribute('type', 'text');
  input2.setAttribute('name', 'author');
  input2.setAttribute('id', 'author');
  input2.setAttribute('value', 'valeur 1');
  input2.setAttribute('placeholder', 'Write the author');
  l2.appendChild(input2);
  // input file
  const lx = document.createElement('fieldset');
  lx.innerHTML = '<legend><label for="cover">Cover</label></legend>';
  parent.appendChild(lx);
  const inputX = document.createElement('input');
  inputX.setAttribute('type', 'file');
  inputX.setAttribute('name', 'cover');
  inputX.setAttribute('id', 'cover');
  inputX.setAttribute('onchange', 'updloadImage()');
  lx.appendChild(inputX);
  // input submit
  const input3 = document.createElement('input');
  input3.setAttribute('type', 'submit');
  input3.setAttribute('value', 'Add');
  parent.appendChild(input3);
  contain.innerHTML = '';
  contain.appendChild(parent);
};

const generateContactForm = () => {
  const parentElement = document.createElement('div');
  parentElement.classList.add('contact');
  const childElement1 = document.createElement('p');
  const textNode = document.createTextNode(
    'Do you have any questions or you just want to say "Hello"?\r\nYou can reach out to us!',
  );
  childElement1.appendChild(textNode);
  const list = document.createElement('ul');
  const item1 = document.createElement('li');
  item1.innerHTML = '<strong>Our e-mail : </strong><a href="mailto:contact@awesomebooks.org">contact@awesomebooks.org</a>';
  const item2 = document.createElement('li');
  item2.innerHTML = '<strong>Our phone number: </strong><a href="tel:+221 78 012 3456">+221 78 012 3456</a>';
  const item3 = document.createElement('li');
  item3.innerHTML = '<strong>Our address: </strong>Street name 22, 84503 City, Country';
  list.appendChild(item1);
  list.appendChild(item2);
  list.appendChild(item3);
  parentElement.appendChild(childElement1);
  parentElement.appendChild(list);
  contain.innerHTML = '';
  contain.appendChild(parentElement);
};

const changeTitle = (itemMenu = '#page-0') => {
  let text = '';
  switch (itemMenu) {
    case '#page-0':
      text = 'All awesome books';
      listofbooks.generateTable();
      break;
    case '#page-1':
      text = 'Add a new book';
      generateAddForm();
      break;
    case '#page-2':
      text = 'Contact information';
      generateContactForm();
      break;
    default:
      text = 'Contact information';
      generateContactForm();
      break;
  }
  h1.innerHTML = text;
};

menu.forEach((x, i) => {
  menu[i].addEventListener('click', () => {
    changeTitle(menu[i].getAttribute('href'));
    menuActive(menu, menu[i]);
  });
});

const formatDate = () => {
  const today = new Date();
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  return today.toLocaleDateString('en-US', options);
};

const generateCurrentDate = () => {
  currentDate.innerHTML = formatDate();
};

window.addEventListener('DOMContentLoaded', (event) => {
  setInterval(generateCurrentDate, 1000);
  changeTitle();
  menuActive(menu, menu[0]);

  listofbooks.books = JSON.parse(localStorage.getItem('datas')) ?? [];
  listofbooks.generateTable();
});

const validateForm = (coverImg = '') => {
  const title = document.getElementById('title');
  const author = document.getElementById('author');

  if (coverImg.trim().length === 0) {
    coverImg = './public/images/default.png';
  }

  const newBook = {
    title: title.value,
    author: author.value,
    created_at: formatDate(),
    cover: coverImg,
    description: '',
  };

  if (listofbooks.addBook(newBook)) {
    title.value = '';
    author.value = '';
    return true;
  }
  return false;
};

const updloadImage = () => {
  const file = document.getElementById('cover').files[0];
  const reader = new FileReader();
  reader.onloadend = () => {
    validateForm(reader.result);
  };
  if (file) {
    reader.readAsDataURL(file);
  }
};

const removeBook = (index) => {
  listofbooks.removeBook(index);
  listofbooks.getData();
  listofbooks.generateTable();
};

const popupBook = (index) => {
  const back = document.createElement('div');
  back.classList.add('fullScreen');
  const popup = document.createElement('div');
  popup.classList.add('popup');

  const side0 = document.createElement('div');
  side0.innerHTML = `<img src="${listofbooks.books[index].cover}" alt="">`;
  popup.appendChild(side0);

  const side1 = document.createElement('div');
  side1.innerHTML = `<h2>${listofbooks.books[index].title}</h2><h3><em>by ${listofbooks.books[index].author}</em></h3><p><em>added ${listofbooks.books[index].created_at}</em></p><p>${listofbooks.books[index].description}</p>`;
  popup.appendChild(side1);

  const link = document.createElement('a');
  link.innerText = 'See less';
  link.setAttribute('onclick', 'closeBtn()');
  link.setAttribute('href', '#');
  side1.appendChild(link);

  back.appendChild(popup);
  document.body.appendChild(back);
  return false;
};

const closeBtn = () => {
  document.body.removeChild(document.querySelector('.fullScreen'));
  return false;
};
