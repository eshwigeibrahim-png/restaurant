import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBeEV-FZ636w7ib4wkif9psNGCx80fjVV8",
  authDomain: "t-marketing-b8446.firebaseapp.com",
  projectId: "t-marketing-b8446",
  storageBucket: "t-marketing-b8446.firebasestorage.app",
  messagingSenderId: "972362540768",
  appId: "1:972362540768:web:0b4ae5e847b271947dd285"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const itemsCollection = collection(db, "menu");

async function addItem() {
  const nameInput = document.getElementById("name");
  const priceInput = document.getElementById("price");

  if (!nameInput || !priceInput) {
    return;
  }

  const name = nameInput.value.trim();
  const price = Number.parseFloat(priceInput.value);

  if (!name || Number.isNaN(price)) {
    alert("أدخل اسم المنتج والسعر فقط");
    return;
  }

  try {
    await addDoc(itemsCollection, { name, price });
    nameInput.value = "";
    priceInput.value = "";
    nameInput.focus();
    alert("تمت الإضافة بنجاح");
  } catch (error) {
    alert("حدث خطأ أثناء الإضافة: " + error.message);
  }
}

async function deleteItem(id) {
  await deleteDoc(doc(db, "menu", id));
}

function renderAdminItems(itemsList, snapshot) {
  itemsList.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const item = docSnap.data();
    itemsList.innerHTML += `
      <div>
        ${item.name} - ${item.price}
        <button onclick="deleteItem('${docSnap.id}')">حذف</button>
      </div>
    `;
  });
}

function renderMenuItems(menuList, snapshot) {
  menuList.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const item = docSnap.data();
    menuList.innerHTML += `
      <div>
        <strong>${item.name}</strong>
        <span>${item.price}</span>
      </div>
    `;
  });
}

const addButton = document.getElementById("addButton");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const itemsList = document.getElementById("itemsList");
const menuList = document.getElementById("menuList");

if (itemsList) {
  onSnapshot(
    itemsCollection,
    (snapshot) => {
      renderAdminItems(itemsList, snapshot);
    },
    (error) => {
      itemsList.innerHTML = `<div>تعذر تحميل عناصر الإدارة: ${error.message}</div>`;
    }
  );
}

if (menuList) {
  onSnapshot(
    itemsCollection,
    (snapshot) => {
      renderMenuItems(menuList, snapshot);
    },
    (error) => {
      menuList.innerHTML = `<div>تعذر تحميل قائمة الزبائن: ${error.message}</div>`;
    }
  );
}

if (addButton) {
  addButton.addEventListener("click", addItem);
}

if (nameInput && priceInput) {
  const submitOnEnter = (event) => {
    if (event.key === "Enter") {
      addItem();
    }
  };

  nameInput.addEventListener("keydown", submitOnEnter);
  priceInput.addEventListener("keydown", submitOnEnter);
}

window.addItem = addItem;
window.deleteItem = deleteItem;
