const AdminBro = require("admin-bro");
const AdminBroExpress = require("admin-bro-expressjs");
const AdminBroMongoose = require("admin-bro-mongoose");
const mongoose = require("mongoose");
const Program = require("../models/program");

AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: "/admin",
});
// const uploadFeature = require("@admin-bro/upload");

// const adminBroOptions = {
//   resources: [
//     {
//       resource: Program,
//       options: {
//         // ...your options go here
//       },
//     },
//   ],
//   branding: {
//     companyName: "Amazing c.o.",
//   },
// };

// const options = {
//   resources: [
//     {
//       resource: Program,
//       options: {
//         listProperties: ["fileUrl", "mimeType"],
//       },
//       features: [
//         uploadFeature({
//           provider: { aws: { upload } },
//           properties: {
//             key: "fileUrl", // to this db field feature will safe S3 key
//             mimeType: "mimeType", // this property is important because allows to have previews
//           },
//           validation: {
//             mimeTypes: "application/pdf",
//           },
//         }),
//       ],
//     },
//   ],
// };

const router = AdminBroExpress.buildRouter(adminBro);

module.exports = router;
