"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const checkSearchNameTerm = (0, express_validator_1.query)('searchNameTerm').default(null);
