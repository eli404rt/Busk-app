"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var generative_ai_1 = require("@google/generative-ai");
var fs = require("fs/promises");
var path = require("path");
function generateImage(prompt, filename, apiKey) {
    return __awaiter(this, void 0, void 0, function () {
        var API_KEY, genAI, imageModel, result, response, imagePart, imageData, imageBuffer, outputPath, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    API_KEY = apiKey;
                    if (!API_KEY) {
                        console.error("API key is not provided.");
                        return [2 /*return*/];
                    }
                    genAI = new generative_ai_1.GoogleGenerativeAI(API_KEY);
                    imageModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp-image-generation" });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, imageModel.generateContent(prompt)];
                case 2:
                    result = _a.sent();
                    return [4 /*yield*/, result.response];
                case 3:
                    response = _a.sent();
                    if (!(response && response.candidates && response.candidates.length > 0)) return [3 /*break*/, 7];
                    imagePart = response.candidates[0].content.parts.find(function (part) { return part.fileData && part.fileData.mimeType.startsWith('image/'); });
                    if (!imagePart) return [3 /*break*/, 5];
                    imageData = imagePart.fileData.data;
                    imageBuffer = Buffer.from(imageData, 'base64');
                    outputPath = path.join(process.cwd(), 'public', 'images', 'gallery', "".concat(filename, ".png"));
                    return [4 /*yield*/, fs.writeFile(outputPath, imageBuffer)];
                case 4:
                    _a.sent();
                    console.log("Image successfully generated and saved to ".concat(outputPath));
                    return [3 /*break*/, 6];
                case 5:
                    console.log("No image data found in the response.");
                    console.log(JSON.stringify(response, null, 2));
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    console.log("No candidates found in the response.");
                    console.log(JSON.stringify(response, null, 2));
                    _a.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_1 = _a.sent();
                    console.error("Error generating image:", error_1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
var prompt = process.argv[2];
var filename = process.argv[3];
var apiKey = process.argv[4];
if (!prompt || !filename || !apiKey) {
    console.error("Usage: node generate-image.js <prompt> <filename> <apiKey>");
    process.exit(1);
}
generateImage(prompt, filename, apiKey);
