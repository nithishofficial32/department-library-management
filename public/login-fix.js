(function () {

    "use strict";

    console.log("🔐 Library Login Fix Loaded");


    function startLoginFix() {

        /*
         * Find every form that contains
         * a password input.
         */

        const forms =
            Array.from(
                document.querySelectorAll("form")
            );


        const loginForm =
            forms.find(
                form =>
                    form.querySelector(
                        'input[type="password"]'
                    )
            );


        if (!loginForm) {

            console.log(
                "Login form not found yet."
            );

            return;

        }


        /*
         * Clone the form.
         *
         * This removes old submit
         * event listeners from script.js.
         */

        const cleanForm =
            loginForm.cloneNode(true);


        loginForm.parentNode.replaceChild(
            cleanForm,
            loginForm
        );


        console.log(
            "✅ Old login handler removed"
        );


        cleanForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                event.stopPropagation();


                const passwordInput =
                    cleanForm.querySelector(
                        'input[type="password"]'
                    );


                /*
                 * Find username/email field.
                 */

                let usernameInput =
                    cleanForm.querySelector(
                        'input[name="username"]'
                    );

                if (!usernameInput) {

                    usernameInput =
                        cleanForm.querySelector(
                            'input[name="email"]'
                        );

                }

                if (!usernameInput) {

                    usernameInput =
                        cleanForm.querySelector(
                            'input[type="email"]'
                        );

                }


                if (!usernameInput) {

                    const inputs =
                        cleanForm.querySelectorAll(
                            "input"
                        );

                    usernameInput =
                        Array.from(inputs)
                            .find(
                                input =>
                                    input !==
                                    passwordInput
                            );

                }


                const username =
                    usernameInput
                        ? usernameInput.value.trim()
                        : "";


                const password =
                    passwordInput
                        ? passwordInput.value
                        : "";


                /*
                 * Find message element.
                 */

                let message =
                    cleanForm.querySelector(
                        ".login-message"
                    );


                if (!message) {

                    message =
                        document.createElement(
                            "div"
                        );

                    message.className =
                        "login-message";

                    message.style.marginTop =
                        "10px";

                    message.style.textAlign =
                        "center";

                    cleanForm.appendChild(
                        message
                    );

                }


                /*
                 * Validation
                 */

                if (!username) {

                    message.style.color =
                        "red";

                    message.textContent =
                        "Please enter username";

                    if (usernameInput) {
                        usernameInput.focus();
                    }

                    return;

                }


                if (!password) {

                    message.style.color =
                        "red";

                    message.textContent =
                        "Please enter password";

                    passwordInput.focus();

                    return;

                }


                /*
                 * Find login button
                 */

                const button =
                    cleanForm.querySelector(
                        'button[type="submit"], input[type="submit"], button'
                    );


                if (button) {

                    button.disabled = true;

                    button.dataset.oldText =
                        button.innerText;

                    button.innerText =
                        "Logging in...";

                }


                message.style.color =
                    "#2563eb";

                message.textContent =
                    "Checking login...";


                try {

                    const response =
                        await fetch(
                            "http://localhost:5000/api/login",
                            {

                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({

                                        username:
                                            username,

                                        password:
                                            password

                                    })

                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            "Invalid username or password"
                        );

                    }


                    /*
                     * Save login session
                     */

                    localStorage.setItem(
                        "libraryToken",
                        data.token
                    );


                    localStorage.setItem(
                        "libraryUser",
                        JSON.stringify(
                            data.user
                        )
                    );


                    message.style.color =
                        "green";

                    message.textContent =
                        "✅ Login successful";


                    /*
                     * Redirect to dashboard
                     */

                    setTimeout(
                        function () {

                            window.location.href =
                                "http://localhost:5000/index.html";

                        },
                        500
                    );


                } catch (error) {

                    console.error(
                        "Login error:",
                        error
                    );


                    message.style.color =
                        "red";

                    message.textContent =
                        error.message ||
                        "Unable to connect to server";


                    if (button) {

                        button.disabled =
                            false;

                        button.innerText =
                            button.dataset.oldText ||
                            "Login";

                    }

                }

            },
            true
        );

    }


    /*
     * Wait until page is ready.
     */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            startLoginFix
        );

    } else {

        startLoginFix();

    }

})();
