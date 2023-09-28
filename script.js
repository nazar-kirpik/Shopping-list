const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const addBtn = itemForm.querySelector('#btn-add');
const updateBtn = itemForm.querySelector('#btn-update');
const themeToggle = document.querySelector('#theme-toggle');
const buttons = document.querySelectorAll('button');

const body = document.querySelector('body');
let isEditMode = false;

body.classList.add('dark-mode');
body.classList.remove('dark-mode');

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  // Validate Input
  if (newItem.trim() === '') {
    swal({
      title: "No item to add",
      text: "Please, add non-empty item!",
      icon: "info",
      button: "OK",
    });
    return;
  }

  // Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    updateBtn.style.display = 'none';
    addBtn.style.display = 'block';

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      swal({
        title: "This item already exists",
        text: "Please, add a different item!",
        icon: "info",
        button: "OK",
      });
      return;
    }
  }

  // Create item DOM element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);

  checkUI();

  itemInput.value = '';
}

function addItemToDOM(item) {
  // Create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  // Add li to the DOM
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  // Add new item to array
  itemsFromStorage.push(item);

  // Convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  addBtn.style.display = 'none';
  updateBtn.style.display = 'block';
  itemInput.value = item.textContent;
}

function removeItem(item) {
  swal({
    title: "Are you sure?",
    text: "Once confirmed, your item will be deleted",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      swal("Item has been deleted", {
        icon: "success",
      });
      // Remove item from DOM
      item.remove();

      // Remove item from storage
      removeItemFromStorage(item.textContent);

      checkUI();
    }
  });
  checkUI();
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Re-set to localstorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
  swal({
    title: "Are you sure?",
    text: "Once confirmed, all your items will be gone",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
      }
  
      // Clear from localStorage
      localStorage.removeItem('items');
  
      checkUI();
      swal("Poof! Your items have been deleted!", {
        icon: "success",
      });
    } else {
      swal("Your items are safe!");
    }
  });
}

function filterItems(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

console.log(buttons)

function toggleTheme() {
  if (body.classList.contains('dark-mode')){
    body.classList.remove('dark-mode');
  } else {
    body.classList.add('dark-mode');
  }
}

function checkUI() {
  itemInput.value = '';

  const items = itemList.querySelectorAll('li');

  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  // addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  // addBtn.style.backgroundColor = '#333';

  isEditMode = false;
}

// Initialize app
function init() {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);
  themeToggle.addEventListener('click', toggleTheme);

  checkUI();
}

init();