<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBeEV-FZ636w7ib4wkif9psNGCx80fjVV8",
    authDomain: "t-marketing-b8446.firebaseapp.com",
    projectId: "t-marketing-b8446",
    storageBucket: "t-marketing-b8446.firebasestorage.app",
    messagingSenderId: "972362540768",
    appId: "1:972362540768:web:0b4ae5e847b271947dd285",
    measurementId: "G-9YQMBKVDPZ"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>

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
