const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

const PORT = 5000;

const USERNAME = "admin";
const EMAIL = "admin@grt.edu.in";
const PASSWORD = "admin123";

const JWT_SECRET =
    "GRT_LIBRARY_SECRET_2026_CHANGE_LATER";


/* =====================================
   MIDDLEWARE
===================================== */

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


/* =====================================
   CORS
   Allows Live Server 5500 to
   communicate with backend 5000
===================================== */

app.use((req, res, next) => {

    res.header(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();

});


/* =====================================
   STATIC FILES
===================================== */

app.use(
    express.static(__dirname)
);


/* =====================================
   PASSWORD HASH
===================================== */

const passwordHash =
    bcrypt.hashSync(
        PASSWORD,
        10
    );


/* =====================================
   SERVER TEST
===================================== */

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            success: true,

            message:
                "GRT Library Backend Working"

        });

    }
);


/* =====================================
   LOGIN API
===================================== */

app.post(
    "/api/login",
    async (req, res) => {

        try {

            console.log("");
            console.log(
                "🔐 LOGIN REQUEST RECEIVED"
            );

            console.log(
                req.body
            );


            const username =
                String(
                    req.body.username ||
                    req.body.userId ||
                    req.body.email ||
                    ""
                ).trim();


            const password =
                String(
                    req.body.password ||
                    ""
                );


            console.log(
                "Username:",
                username
            );


            if (!username || !password) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please enter username and password"

                });

            }


            const validUsername =

                username.toLowerCase() ===
                USERNAME.toLowerCase()

                ||

                username.toLowerCase() ===
                EMAIL.toLowerCase();


            if (!validUsername) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid username or password"

                });

            }


            const validPassword =
                await bcrypt.compare(
                    password,
                    passwordHash
                );


            if (!validPassword) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid username or password"

                });

            }


            const token =
                jwt.sign(

                    {
                        username:
                            USERNAME,

                        email:
                            EMAIL,

                        role:
                            "admin"

                    },

                    JWT_SECRET,

                    {
                        expiresIn:
                            "4h"
                    }

                );


            console.log(
                "✅ LOGIN SUCCESS"
            );


            return res.json({

                success: true,

                message:
                    "Login successful",

                token:

                    token,

                user: {

                    username:
                        USERNAME,

                    email:
                        EMAIL,

                    role:
                        "admin"

                }

            });


        }

        catch (error) {

            console.error(
                "❌ LOGIN ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Backend login error"

            });

        }

    }
);


/* =====================================
   AUTHENTICATION
===================================== */

function authenticate(
    req,
    res,
    next
) {

    const auth =
        req.headers.authorization;


    if (
        !auth ||
        !auth.startsWith(
            "Bearer "
        )
    ) {

        return res.status(401).json({

            success: false,

            message:
                "Login required"

        });

    }


    const token =
        auth.split(" ")[1];


    try {

        req.user =
            jwt.verify(
                token,
                JWT_SECRET
            );

        next();

    }

    catch {

        return res.status(401).json({

            success: false,

            message:
                "Session expired"

        });

    }

}


/* =====================================
   CHECK LOGIN
===================================== */

app.get(
    "/api/me",
    authenticate,
    (req, res) => {

        res.json({

            success: true,

            user:
                req.user

        });

    }
);



/* ==========================================
   DASHBOARD SAFETY ROUTE
   Existing project uses index.html
========================================== */

app.get("/dashboard.html", (req, res) => {
    res.sendFile(
        path.join(__dirname, "index.html")
    );
});


/* =====================================
   START SERVER
===================================== */

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log("");
        console.log(
            "=========================================="
        );

        console.log(
            "📚 GRT LIBRARY MANAGEMENT SYSTEM"
        );

        console.log(
            "=========================================="
        );

        console.log("");

        console.log(
            "🌐 Open:"
        );

        console.log(
            "http://localhost:5000"
        );

        console.log("");

        console.log(
            "🔐 USERNAME:"
        );

        console.log(
            "admin"
        );

        console.log("");

        console.log(
            "🔑 PASSWORD:"
        );

        console.log(
            "admin123"
        );

        console.log("");

        console.log(
            "=========================================="
        );

        console.log("");

    }
);
