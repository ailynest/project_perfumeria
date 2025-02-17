/*Ailyn Estevez ☺*/
var listaregistro = JSON.parse(localStorage.getItem("tablaregistrados")) || [];

document.getElementById("registrar").addEventListener("click", async(event) => {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente, si hay errores para

    var nombre = document.getElementById("nombre").value.trim(); 
    var apellido = document.getElementById("apellido").value.trim();
    var usuario = document.getElementById("usuario").value.trim();
    var genero = document.getElementById("genero").value;
    var date = document.getElementById("fecha").value;
    var email = document.getElementById("email").value.trim();
    var pass = document.getElementById("contraseña").value;
    var confirmpass = document.getElementById("confirmarcontraseña").value;
    var photo = document.getElementById("photo").files[0]; // Obtén el archivo seleccionado
    console.log(nombre, apellido, usuario, genero, date, email, pass, confirmpass, photo);

    // Limpiar mensajes de error anteriores
    const mensajesError = document.getElementById("mensajes-error");
    mensajesError.innerHTML = "";
    const mensajeExito = document.getElementById("mensaje-exito");
    mensajeExito.innerHTML = "";
    mensajeExito.style.display = "none"; // NO mostrar el mensaje
    
    let isValid = true; // Comprobar la validez de los datos del formulario

    // Validación de cada campo individualmente
    if (!photo) {
        mensajesError.innerHTML += "<p>Debes subir una foto.</p>";
        isValid = false;
    }

    if (!nombre) {
        mensajesError.innerHTML += "<p>El campo Nombre está vacío.</p>";
        isValid = false;
    } else if (nombre.length < 2 || nombre.length > 15) {
        mensajesError.innerHTML += "<p>El nombre debe tener entre 2 y 15 caracteres.</p>";
        isValid = false;
    }

    if (!apellido) {
        mensajesError.innerHTML += "<p>El campo Apellido está vacío.</p>";
        isValid = false;
    } else if (apellido.length < 2 || apellido.length > 15) {
        mensajesError.innerHTML += "<p>El apellido debe tener entre 2 y 15 caracteres.</p>";
        isValid = false;
    }

    if (!usuario) {
        mensajesError.innerHTML += "<p>El campo Usuario está vacío.</p>";
        isValid = false;
    } else if (usuario.length < 4 || usuario.length > 10) {
        mensajesError.innerHTML += "<p>El usuario debe tener entre 4 y 10 caracteres.</p>";
        isValid = false;
    }

    if (!email) {
        mensajesError.innerHTML += "<p>El campo Email está vacío.</p>";
        isValid = false;
    } else {
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            mensajesError.innerHTML += "<p>Por favor, introduce un correo electrónico válido.</p>";
            isValid = false;
        }
    }

    if (!date) {
        mensajesError.innerHTML += "<p>El campo Fecha de nacimiento está vacío.</p>";
        isValid = false;
    }

    if (!pass) {
        mensajesError.innerHTML += "<p>El campo Contraseña está vacío.</p>";
        isValid = false;
    } else if (pass.length < 6 || pass.length > 15) {
        mensajesError.innerHTML += "<p>La contraseña debe tener entre 6 y 15 caracteres.</p>";
        isValid = false;
    } else {
        var specialcharacter = /[!@#$%^&*(),.?":{}|<>]/;
        if (!specialcharacter.test(pass)) {
            mensajesError.innerHTML += "<p>La contraseña debe contener al menos un carácter especial.</p>";
            isValid = false;
        }
    }

    if (!confirmpass) {
        mensajesError.innerHTML += "<p>El campo Repetir contraseña está vacío.</p>";
        isValid = false;
    } else if (pass !== confirmpass) {
        mensajesError.innerHTML += "<p>Las contraseñas no coinciden.</p>";
        isValid = false;
    }

    if (isValid) {
        var reader = new FileReader();
        reader.onload = async function(event) {
            var photoDataUrl = event.target.result; // Obtén la imagen en Base64
            var newregistro = { name: nombre, lastname: apellido, user: usuario, email: email, password: pass };
            listaregistro.push(newregistro);   
            localStorage.setItem("tablaregistrados", JSON.stringify(listaregistro)); // Guarda en localStorage
            
            // Crear FormData antes de enviar al servidor
            // const formData = new FormData(document.getElementById("formulario"));

            // // Verificar si la foto está en FormData antes de enviarla
            // for (let [key, value] of formData.entries()) {
            //     console.log(`${key}: ${value}`);
            // }

            // // Verificar si el FormData contiene la foto antes de enviarlo
            // console.log(formData.get('photo'));  // Esto debería mostrar el archivo cargado

            // Enviar los datos al servidor JSON
            // try {
            //     const response = await fetch('/upload', {
            //         method: 'POST',
            //         body: formData
            //     });
            //     if (response.ok) {
            //         //document.getElementById('mensaje').textContent = 'Usuario añadido correctamente.';
            //         setTimeout(() => {
            //             window.location.href = 'index.html'; // Redirige después de 2 segundos
            //         }, 2000);
            //     } else {
            //         const error = await response.text();
            //         //document.getElementById('mensaje').textContent = `Error al añadir el usuario: ${error}`;
            //         alert(`Error al añadir el usuario: ${error}`);
            //     }
            // } catch (error) {
            //     //document.getElementById('mensaje').textContent = `Error de conexión: ${err.message}`;
            //     alert(`Error de conexión: ${error.message}`);
            // }
            // Enviar los datos a la base de datos 
                // const response = await fetch('/upload', {
                // method: 'POST',
                // //headers: { 'Content-Type': 'application/json' },
                // body: formData//JSON.stringify(newUser)
                // });
                // const data = await response.json();
                // if (data.success) {
                // alert('Usuario añadido correctamente');
                // window.location.href = 'index.html';
                // } else {
                // alert('Error al añadir el alumno');
                // }


                // Crear un FormData para enviar los datos del formulario y la foto
                    const formData = new FormData();
                    formData.append('nombre', nombre);
                    formData.append('apellido', apellido);
                    formData.append('usuario', usuario);
                    formData.append('email', email);
                    formData.append('pass', pass);
                    formData.append('photo', photo);  // Adjuntamos el archivo

                    try {
                        // Enviar los datos al servidor
                        const response = await fetch('/upload', {
                            method: 'POST',
                            body: formData,
                        });

                        const data = await response.json(); // Esto convierte la respuesta en JSON

                        if (data.success) {
                            alert('Usuario añadido correctamente');
                            //window.location.href = 'index.html'; // Redirigir al index
                            window.location.href = '/login.html'; // Redirigir a la página de login
                            // Mostrar el mensaje de éxito
                            const mensajeExito = document.getElementById("mensaje-exito");
                            mensajeExito.innerHTML = "<p>¡Registro completado con éxito!</p>";
                            mensajeExito.style.display = "block"; // Mostrar el mensaje
                        } else {
                            alert(`Error: ${data.error}`); // Mostrar el error recibido desde el servidor
                        }
                    } catch (error) {
                        alert('Error de conexión: ' + error.message);
                    }

    

            document.getElementById("formulario").reset(); // Limpia el formulario cuando todo es válido

            // Oculta la vista previa
            document.getElementById("preview").style.display = "none";
        };

        reader.readAsDataURL(photo); // Lee la foto como Base64
    }
});


//►► Establecer la fecha máxima en el campo de fecha a la fecha actual
var today = new Date();
var year = today.getFullYear();
var month = today.getMonth() + 1; // Los meses comienzan en 0, por eso sumamos 1
var day = today.getDate();
// Si el mes o el día son menores a 10, agregar un 0 delante (formato necesario: YYYY-MM-DD)
if (month < 10) month = '0' + month;
if (day < 10) day = '0' + day;

var maxDate = year + '-' + month + '-' + day;
document.getElementById("fecha").setAttribute("max", maxDate);

//►► Evento para previsualizar la foto cargada
document.getElementById("photo").addEventListener("change", function(event) {
    var photoFile = event.target.files[0];

    if (photoFile) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var photoDataUrl = event.target.result;
            var preview = document.getElementById("preview");

            preview.src = photoDataUrl; // Asigna la foto a la vista previa
            preview.style.display = "block"; // Muestra la vista previa
        };
        reader.readAsDataURL(photoFile); // Convierte la foto a Base64 para previsualización
    } else {
        document.getElementById("preview").style.display = "none"; // Oculta la vista previa si no hay foto
    }
});

//►► Evento para visualizar la contraseña
function togglePassword(id) {
    var passwordField = document.getElementById(id);
    var icon = document.getElementById('toggle-' + id); // Obtener el ícono del ojo
    if (passwordField.type === "password") {
        passwordField.type = "text"; // Muestra la contraseña
        icon.classList.remove('fa-eye'); // Cambia el ícono
        icon.classList.add('fa-eye-slash'); // Ícono para ocultar
    } else {
        passwordField.type = "password"; // Oculta la contraseña
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}