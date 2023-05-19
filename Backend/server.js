const imports = require("./import");
const middleware = require("./middlewares");
const passportOptions = require("./passport-options");
const cors = require('cors'); // استيراد وحدة cors

// تطبيق Express
const app = imports.express();

imports.dotenv.config({ path: "config.env" });

// الاتصال بقاعدة البيانات MongoDB باستخدام Mongoose
imports.configration();

// وسيطات Middleware
app.use(cors()); // استخدام وحدة cors كوسيطة
middleware(app);
passportOptions.startOptions();

if (process.env.MODEL_ENV === "development") {
  app.use(imports.morgan("dev"));
  console.log(`mode : ${process.env.MODEL_ENV}`);
}

app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.statusCode).json({
    status: false,
    message: error.message,
  });
});

//*** المسارات (Routes)
app.use("/api/v1/auth/", imports.Router);
app.use("/api/v1/mission/", imports.RouterTask);

app.listen(process.env.PORT || 5000, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
