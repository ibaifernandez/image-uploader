document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const fileInput = document.querySelector("input[type=file]");
    const submitButton = document.querySelector("button[type=submit]");
    const message = document.createElement("div");
    message.style.marginTop = "1rem";
    form.appendChild(message);

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const file = fileInput.files[0];
        if (file && file.size < 5 * 1024 * 1024) {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = function () {
                const imageData = reader.result.split(",")[1];
                const apiUrl = "https://api.imgur.com/3/image";
                const apiKey = "";
                const formData = new FormData();
                formData.append("image", imageData);
                submitButton.disabled = true;
                message.textContent = "Subiendo imagen...";
                fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        Authorization: "Client-ID " + apiKey,
                    },
                    body: formData,
                })
                    .then(function (response) {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error("Error al subir imagen");
                        }
                    })
                    .then(function (data) {
                        submitButton.disabled = false;
                        message.innerHTML = `<span>Imagen subida con éxito a <a href=${data.data.link} target="_blank">${data.data.link}</a></span>`;
                        console.log(data);
                    })
                    .catch(function (error) {
                        submitButton.disabled = false;
                        message.textContent =
                            "Error al subir imagen: " + error.message;
                        console.error(error);
                    });
            };
        } else {
            message.textContent = "El archivo debe ser menor a 5 MB";
        }
    });
});
