import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBS8UlW9KCkrP4FspB9azu63srStuCR0tU",
  authDomain: "cafe-menu-3898b.firebaseapp.com",
  projectId: "cafe-menu-3898b",
  storageBucket: "cafe-menu-3898b.firebasestorage.app",
  messagingSenderId: "606722530073",
  appId: "1:606722530073:web:29a7eacd500e0463488388",
  measurementId: "G-XS7Y5LFDY1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const itemsCollection = collection(db, "menu");

console.log("Firebase module loaded", { projectId: firebaseConfig.projectId });

// وظائف لوحة التحكم
async function addItem() {
  const name = document.getElementById("name").value.trim();
  const price = parseFloat(document.getElementById("price").value);

  if (name && !Number.isNaN(price)) {
    try {
      console.log("Adding product:", { name, price });
      await addDoc(itemsCollection, { name, price });
      console.log("تم إضافة المنتج");
      document.getElementById("name").value = "";
      document.getElementById("price").value = "";
    } catch (error) {
      console.error("خطأ في إضافة المنتج:", error);
      alert("حدث خطأ أثناء حفظ المنتج. تفقد وحدة التحكم لمعرفة التفاصيل.");
    }
  } else {
    alert("رجاءً أدخل اسم المنتج والسعر.");
  }
}

// حذف عنصر
async function deleteItem(id) {
  try {
    await deleteDoc(doc(db, "menu", id));
  } catch (error) {
    console.error("خطأ في حذف المنتج:", error);
  }
}

// التحديث المباشر لكل صفحة
onSnapshot(itemsCollection, snapshot => {
  const itemsList = document.getElementById("itemsList") || document.getElementById("menuList");
  if (!itemsList) {
    console.warn("لم يتم العثور على عنصر العرض في الصفحة.");
    return;
  }

  console.log("Firebase snapshot received:", snapshot.size);
  itemsList.innerHTML = "";
  snapshot.forEach(docSnap => {
    const item = docSnap.data();
    if (itemsList.id === "itemsList") {
      itemsList.innerHTML += `<div>
        <strong>${item.name}</strong> - ${item.price} دينار
        <button onclick="deleteItem('${docSnap.id}')">حذف</button>
      </div>`;
    } else {
      itemsList.innerHTML += `<div>
        <strong>${item.name}</strong> - ${item.price} دينار
      </div>`;
    }
  });
}, error => {
  console.error("خطأ في استلام البيانات:", error);
});

window.addItem = addItem;
window.deleteItem = deleteItem;