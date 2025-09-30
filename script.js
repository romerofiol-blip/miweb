// ===== Modo oscuro/claro =====
const modoBtn = document.getElementById("modoBtn");

// Cargar preferencia de localStorage
if(localStorage.getItem("modo") === "dark") document.body.classList.add("dark-mode");

modoBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const icon = modoBtn.querySelector("i");
  icon.classList.toggle("bi-moon");
  icon.classList.toggle("bi-sun");

  // Guardar preferencia
  if(document.body.classList.contains("dark-mode")) localStorage.setItem("modo","dark");
  else localStorage.setItem("modo","light");
});

// ===== Login Admin =====
const ADMIN_KEY = "Admin123/*-";
const loginBtn = document.getElementById("loginBtn");
const adminPass = document.getElementById("adminPass");
const errorMsg = document.getElementById("errorMsg");

loginBtn.addEventListener("click", () => {
  if(adminPass.value === ADMIN_KEY){
    bootstrap.Modal.getInstance(document.getElementById("loginAdmin")).hide();
    new bootstrap.Modal(document.getElementById("panelAdmin")).show();
    adminPass.value = "";
    errorMsg.classList.add("d-none");
  } else {
    errorMsg.classList.remove("d-none");
  }
});

// ===== LocalStorage =====
let productos = JSON.parse(localStorage.getItem("productos")) || [];
let videos = JSON.parse(localStorage.getItem("videos")) || [];
let nota = localStorage.getItem("nota") || "Catálogo moderno de muebles y videos para tu hogar";
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let quienes = JSON.parse(localStorage.getItem("quienes")) || {img:"", desc:"", tel:""};

// ===== Elementos =====
const listaProductos = document.getElementById("listaProductos");
const listaVideos = document.getElementById("listaVideos");
const prodForm = document.getElementById("productoForm");
const videoForm = document.getElementById("videoForm");
const notaTexto = document.getElementById("notaTexto");
const guardarNota = document.getElementById("guardarNota");
const notaPrincipal = document.getElementById("notaPrincipal");
const contadorCarrito = document.getElementById("contadorCarrito");
const listaCarrito = document.getElementById("listaCarrito");
const contadorCarritoFlotante = document.getElementById("contadorCarritoFlotante");
const pedidoWhatsApp = document.getElementById("pedidoWhatsApp");

// Quienes Somos
const fotoQuienes = document.getElementById("fotoQuienes");
const descQuienesText = document.getElementById("descQuienesText");
const telQuienesText = document.getElementById("telQuienesText");

// Panel admin Quienes Somos
const quienesForm = document.getElementById("quienesForm");
const quienesImgFile = document.getElementById("quienesImgFile");
const quienesDesc = document.getElementById("quienesDesc");
const quienesTel = document.getElementById("quienesTel");

// Modal pedido
const pedidoModal = new bootstrap.Modal(document.getElementById("pedidoModal"));
const pedidoForm = document.getElementById("pedidoForm");

// ===== Nota =====
function actualizarNota() {
  notaPrincipal.textContent = nota;
  notaTexto.value = nota;
}
actualizarNota();
guardarNota.addEventListener("click", () => {
  nota = notaTexto.value.trim() || nota;
  localStorage.setItem("nota", nota);
  actualizarNota();
});

// ===== Quienes Somos =====
function renderQuienes() {
  fotoQuienes.src = quienes.img || "";
  descQuienesText.textContent = quienes.desc || "";
  telQuienesText.textContent = quienes.tel || "";
}
renderQuienes();

quienesForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const file = quienesImgFile.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = (ev)=>{
      quienes.img = ev.target.result;
      quienes.desc = quienesDesc.value.trim();
      quienes.tel = quienesTel.value.trim();
      localStorage.setItem("quienes", JSON.stringify(quienes));
      renderQuienes();
      quienesForm.reset();
    };
    reader.readAsDataURL(file);
  } else {
    quienes.desc = quienesDesc.value.trim();
    quienes.tel = quienesTel.value.trim();
    localStorage.setItem("quienes", JSON.stringify(quienes));
    renderQuienes();
  }
});

// ===== Carrito =====
function renderCarrito(){
  listaCarrito.innerHTML = "";
  let total = 0;
  carrito.forEach((prod, index) => {
    total += prod.cantidad;
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      ${prod.nombre} x <input type="number" class="cantidadInput" min="1" max="100" value="${prod.cantidad}">
      <button class="btn btn-sm btn-danger">Eliminar</button>`;
    
    li.querySelector(".cantidadInput").addEventListener("change", (e) => {
      const val = parseInt(e.target.value);
      prod.cantidad = val > 0 ? val : 1;
      e.target.value = prod.cantidad;
      localStorage.setItem("carrito", JSON.stringify(carrito));
      renderCarrito();
    });

    li.querySelector("button").addEventListener("click", () => {
      carrito.splice(index,1);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      renderCarrito();
    });

    listaCarrito.appendChild(li);
  });
  contadorCarrito.textContent = total;
  contadorCarritoFlotante.textContent = total;
}

// ===== Pedido WhatsApp =====
pedidoWhatsApp.addEventListener("click", ()=>{
  if(carrito.length ===0){ alert("El carrito está vacío."); return; }
  pedidoModal.show();
});

// ===== Enviar pedido desde modal =====
pedidoForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  const nombre = document.getElementById("pedidoNombre").value.trim();
  const direccion = document.getElementById("pedidoDireccion").value.trim();
  const provincia = document.getElementById("pedidoProvincia").value.trim();
  const municipio = document.getElementById("pedidoMunicipio").value.trim();
  const envio = document.getElementById("pedidoEnvio").value;
  if(!nombre||!direccion||!provincia||!municipio){ alert("Complete todos los campos"); return; }

  let mensaje = `Hola, mis datos para el pedido:\nNombre: ${nombre}\nDirección: ${direccion}\nProvincia: ${provincia}\nMunicipio: ${municipio}\nEnvío a domicilio: ${envio}\nProductos:\n`;
  carrito.forEach(p => mensaje += `- ${p.nombre} x${p.cantidad}\n`);
  const telefono = "5350124969";
  window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, "_blank");
  pedidoModal.hide();
});

// ===== Productos =====
function renderProductos() {
  listaProductos.innerHTML = "";
  const catalogo = document.getElementById("catalogo").querySelector(".row");
  catalogo.innerHTML = "";
  productos.slice(0,10).forEach((prod, index) => {
    // Admin lista
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `<img src="${prod.img}" alt="${prod.nombre}"> ${prod.nombre} - ${prod.desc} 
      <div>
        <button class="btn btn-sm btn-warning me-1">Editar</button>
        <button class="btn btn-sm btn-danger">Eliminar</button>
      </div>`;
    
    li.querySelector(".btn-danger").addEventListener("click", () => {
      productos.splice(index,1);
      localStorage.setItem("productos", JSON.stringify(productos));
      renderProductos();
    });

    li.querySelector(".btn-warning").addEventListener("click", () => {
      document.getElementById("prodNombre").value = prod.nombre;
      document.getElementById("prodDesc").value = prod.desc;
      prodForm.onsubmit = (e) => {
        e.preventDefault();
        prod.nombre = document.getElementById("prodNombre").value.trim();
        prod.desc = document.getElementById("prodDesc").value.trim();
        localStorage.setItem("productos", JSON.stringify(productos));
        renderProductos();
        prodForm.reset();
        prodForm.onsubmit = agregarProducto;
      };
    });

    listaProductos.appendChild(li);

    // Catálogo
    const col = document.createElement("div");
    col.className = "col-md-4";
    col.setAttribute("data-fade", "");
    col.innerHTML = `<div class="card h-100 shadow-sm">
      <img src="${prod.img}" class="card-img-top" alt="${prod.nombre}">
      <div class="card-body">
        <h5 class="card-title">${prod.nombre}</h5>
        <p class="card-text">${prod.desc.substring(0,60)}...</p>
        <button class="btn btn-primary verMasBtn me-2">Ver más</button>
        <button class="btn btn-success agregarCarritoBtn me-2">Agregar al carrito</button>
        <button class="btn btn-warning solicitarPrecioBtn">Solicitar precio</button>
      </div></div>`;
    
    setTimeout(() => { col.querySelector(".card").classList.add("visible"); }, index*100);

    // Eventos
    col.querySelector(".verMasBtn").addEventListener("click", () => {
      document.getElementById("verMasTitulo").textContent = prod.nombre;
      document.getElementById("verMasImagen").src = prod.img;
      document.getElementById("verMasDesc").textContent = prod.desc;
      new bootstrap.Modal(document.getElementById("verMasModal")).show();
    });

    col.querySelector(".agregarCarritoBtn").addEventListener("click", () => {
      const existente = carrito.find(p => p.nombre === prod.nombre);
      if(existente) existente.cantidad += 1;
      else carrito.push({nombre:prod.nombre, desc:prod.desc, cantidad:1});
      localStorage.setItem("carrito", JSON.stringify(carrito));
      renderCarrito();
    });

    col.querySelector(".solicitarPrecioBtn").addEventListener("click", () => {
      const telefono = "5350124969";
      const mensaje = `Hola, quisiera saber el precio de este producto:\n- ${prod.nombre}`;
      window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, "_blank");
    });

    catalogo.appendChild(col);
  });
}

function agregarProducto(e) {
  e.preventDefault();
  const nombre = document.getElementById("prodNombre").value.trim();
  const desc = document.getElementById("prodDesc").value.trim();
  const file = document.getElementById("prodImgFile").files[0];
  const url = document.getElementById("prodImgURL").value.trim();
  if(nombre && desc){
    if(file){
      const reader = new FileReader();
      reader.onload = (e) => {
        productos.push({nombre, desc, img:e.target.result});
        localStorage.setItem("productos", JSON.stringify(productos));
        renderProductos();
        prodForm.reset();
      };
      reader.readAsDataURL(file);
    } else if(url) {
      productos.push({nombre, desc, img:url});
      localStorage.setItem("productos", JSON.stringify(productos));
      renderProductos();
      prodForm.reset();
    } else {
      alert("Debes agregar una imagen desde tu PC o una URL válida");
    }
  }
}
prodForm.addEventListener("submit", agregarProducto);
renderProductos();

// ===== Videos =====
function renderVideos() {
  listaVideos.innerHTML = "";
  const videosSeccion = document.getElementById("videos").querySelector(".row");
  videosSeccion.innerHTML = "";
  videos.forEach((v,index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `<span>${v}</span> <button class="btn btn-sm btn-danger">Eliminar</button>`;
    li.querySelector("button").addEventListener("click", () => {
      videos.splice(index,1);
      localStorage.setItem("videos", JSON.stringify(videos));
      renderVideos();
    });
    listaVideos.appendChild(li);

    const col = document.createElement("div");
    col.className = "col-md-6";
    col.setAttribute("data-fade", "");
    col.innerHTML = `<div class="ratio ratio-16x9"><iframe src="${v}" allowfullscreen></iframe></div>`;
    videosSeccion.appendChild(col);
  });
}

videoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = document.getElementById("videoUrl").value.trim();
  const file = document.getElementById("videoFile").files[0];
  if(url){ videos.push(url); localStorage.setItem("videos", JSON.stringify(videos)); renderVideos(); videoForm.reset();}
  else if(file && file.type.includes("video")){
    const reader = new FileReader();
    reader.onload = (e) => {
      videos.push(e.target.result);
      localStorage.setItem("videos", JSON.stringify(videos));
      renderVideos();
      videoForm.reset();
    };
    reader.readAsDataURL(file);
  } else if(file){ alert("Formato no permitido. Solo .mp4 o URL de YouTube"); }
});
renderVideos();

// ===== Animaciones fade-in al scroll =====
function fadeInScroll(){
  const elems = document.querySelectorAll("[data-fade]");
  elems.forEach(e => {
    const rect = e.getBoundingClientRect();
    if(rect.top < window.innerHeight - 50) e.classList.add("visible");
  });
}
window.addEventListener("scroll", fadeInScroll);
fadeInScroll();

// ===== Renderizar carrito al iniciar =====
renderCarrito();
