// IMPORTACIONES FIREBASE

import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// CONFIGURACIÓN (CÓDIGO DADO EN FIREBASE)

const firebaseConfig = {
    apiKey: "AIzaSyAlyZcWUKRZomeHI_uYgyAv37fY-TFcDjo",
    authDomain: "crud-firebase-app-4b685.firebaseapp.com",
    projectId: "crud-firebase-app-4b685",
    storageBucket: "crud-firebase-app-4b685.firebasestorage.app",
    messagingSenderId: "563802252744",
    appId: "1:563802252744:web:72fe39e5f2b861c2f34cfd"
};


// INICIALIZAR

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// CRUD

let datos = [];


// AGREGAR PRODUCTO
window.agregar = async function () {

    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;

    if (nombre === "" || precio === "") {
        alert("Completa todos los campos");
        return;
    }

    await addDoc(
        collection(db, "productos"),
        {
        nombre,
        precio
        }
    );

    alert("Producto agregado");

    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";

    leer();
};


// LEER PRODUCTOS

async function leer() {

    datos = [];

    const querySnapshot =
        await getDocs(collection(db, "productos"));

    querySnapshot.forEach((docu) => {

    datos.push({
      id: docu.id,
      ...docu.data()
    });

    });

    mostrar(datos);
}


// MOSTRAR

function mostrar(lista) {

    const tabla = document.getElementById("tabla");

    tabla.innerHTML = "";

    lista.forEach((d) => {

    tabla.innerHTML += `
        <tr>
            <td>${d.nombre}</td>
            <td>${d.precio}</td>
            <td>
            <button onclick="eliminar('${d.id}')">
                Eliminar
            </button>

            <button onclick="editar('${d.id}')">
                Editar
            </button>
            </td>
        </tr>
        `;

    });
}


// ELIMINAR

window.eliminar = async function (id) {

    await deleteDoc(
        doc(db, "productos", id)
    );

    leer();
};


// EDITAR

window.editar = async function (id) {

    const nuevoNombre =
        prompt("Nuevo nombre:");

    const nuevoPrecio =
        prompt("Nuevo precio:");

    if (!nuevoNombre || !nuevoPrecio) return;

    await updateDoc(
        doc(db, "productos", id),
        {
        nombre: nuevoNombre,
        precio: nuevoPrecio
        }
    );

    leer();
};


// FILTRAR

window.filtrar = function () {

    const texto =
        document.getElementById("buscar")
        .value
        .toLowerCase();

    const filtrados =
        datos.filter(d =>
        d.nombre
        .toLowerCase()
        .includes(texto)
        );

    mostrar(filtrados);
};


// CARGA INICIAL

leer();