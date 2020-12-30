"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = __importDefault(require("joi"));
var schema = joi_1.default.object({
    username: joi_1.default.string().required().alphanum().min(4).max(20),
    password: joi_1.default.string()
        .required()
        .pattern(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{6,30}$/),
    email: joi_1.default.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ir"] } }),
});
exports.default = schema;
