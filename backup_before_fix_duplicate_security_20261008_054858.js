const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();

/* =====================================
   SECURITY MIDDLEWARE
===================================== */

app.disable("x-powered-by");

app.use(
    helmet({
        contentSecurityPolicy: false
    })
);

const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many login attempts. Please try again later."
    }
});

const apiRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use("/api", apiRateLimit);

/* =====================================
   SECURITY MIDDLEWARE
===================================== */

app.disable("x-powered-by");

app.use(
    helmet({
        contentSecurityPolicy: false
    })
);

const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many login attempts. Please try again later."
    }
});

const apiRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use("/api", apiRateLimit);

const PORT = process.env.PORT || 5000;

const USERNAME = "admin";
const EMAIL = "admin@grt.edu.in";
const PASSWORD = "admin123";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing from .env");
    process.exit(1);
}




/* =====================================
   MONGODB CONNECTION
===================================== */

const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/grt_library";

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log("");
        console.log("🟢 MongoDB connected");
        console.log("📦 Database: grt_library");
        console.log("");
    })
    .catch((error) => {
        console.error("");
        console.error("🔴 MongoDB connection failed:");
        console.error(error.message);
        console.error("");
    });

/* =====================================
   MONGODB BOOK MODEL
===================================== */

const bookSchema = new mongoose.Schema(
    {
        accn: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        data: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Book = mongoose.model("Book", bookSchema);


/* =====================================
   MIDDLEWARE
===================================== */

app.use(express.json({ limit: '20mb' }));

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
   BOOK / CATALOGUE API
===================================== */

/*
   GET ALL BOOKS
*/
app.get(
    "/api/books",
    async (req, res) => {

        try {

            const records =
                await Book.find()
                    .sort({ createdAt: 1 })
                    .lean();

            const books =
                records.map(record => ({
                    ...(record.data || {}),
                    accn: record.accn
                }));

            return res.json({
                success: true,
                books: books
            });

        } catch (error) {

            console.error(
                "❌ GET BOOKS ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Unable to load books"
            });

        }

    }
);


/*
   SAVE / SYNC ALL BOOKS
*/
app.post(
    "/api/books/sync",
    async (req, res) => {

        try {

            const books =
                Array.isArray(req.body.books)
                    ? req.body.books
                    : [];

            const cleanedBooks = [];

            const seen = new Set();

            for (const originalBook of books) {

                if (!originalBook) {
                    continue;
                }

                const book = {
                    ...originalBook
                };

                const accn =
                    String(
                        book.accn ||
                        book.accession ||
                        book.accessionNumber ||
                        ""
                    ).trim();

                if (!accn) {
                    continue;
                }

                const duplicateKey =
                    accn.toLowerCase();

                if (seen.has(duplicateKey)) {
                    continue;
                }

                seen.add(duplicateKey);

                book.accn = accn;

                cleanedBooks.push(book);
            }


            await Book.deleteMany({});


            if (cleanedBooks.length > 0) {

                await Book.insertMany(
                    cleanedBooks.map(book => ({
                        accn: book.accn,
                        data: book
                    }))
                );

            }


            return res.json({

                success: true,

                message:
                    "Books synchronized successfully",

                count:
                    cleanedBooks.length

            });

        } catch (error) {

            console.error(
                "❌ SYNC BOOKS ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to save books"

            });

        }

    }
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


// ============================================================
// GRT LIBRARY - MONGODB FULL DATA SYNC
// ============================================================

const libraryDataSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            unique: true,
            required: true
        },
        books: {
            type: Array,
            default: []
        },
        members: {
            type: Array,
            default: []
        },
        issues: {
            type: Array,
            default: []
        },
        reservations: {
            type: Array,
            default: []
        },
        fines: {
            type: Array,
            default: []
        }
    },
    {
        timestamps: true
    }
);

const LibraryData =
    mongoose.models.LibraryData ||
    mongoose.model("LibraryData", libraryDataSchema);


// GET ALL LMS LIBRARY DATA
app.get("/api/library-data", async (req, res) => {
    try {
        const data = await LibraryData.findOne({
            key: "main"
        }).lean();

        if (!data) {
            return res.json({
                success: true,
                exists: false,
                books: [],
                members: [],
                issues: [],
                reservations: [],
                fines: []
            });
        }

        res.json({
            success: true,
            exists: true,
            books: Array.isArray(data.books) ? data.books : [],
            members: Array.isArray(data.members) ? data.members : [],
            issues: Array.isArray(data.issues) ? data.issues : [],
            reservations: Array.isArray(data.reservations)
                ? data.reservations
                : [],
            fines: Array.isArray(data.fines) ? data.fines : []
        });

    } catch (error) {
        console.error("❌ Library data load failed:", error);

        res.status(500).json({
            success: false,
            message: "Library data load failed"
        });
    }
});


// SAVE ALL LMS LIBRARY DATA
app.post("/api/library-data", async (req, res) => {
    try {
        const body = req.body || {};

        const cleanArray = value =>
            Array.isArray(value) ? value : [];

        const data = await LibraryData.findOneAndUpdate(
            { key: "main" },
            {
                key: "main",
                books: cleanArray(body.books),
                members: cleanArray(body.members),
                issues: cleanArray(body.issues),
                reservations: cleanArray(body.reservations),
                fines: cleanArray(body.fines)
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        ).lean();

        res.json({
            success: true,
            message: "Library data saved successfully",
            counts: {
                books: data.books.length,
                members: data.members.length,
                issues: data.issues.length,
                reservations: data.reservations.length,
                fines: data.fines.length
            }
        });

    } catch (error) {
        console.error("❌ Library data save failed:", error);

        res.status(500).json({
            success: false,
            message: "Library data save failed"
        });
    }
});

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