"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const checkPageNumber = (0, express_validator_1.query)('pageNumber').default(1);
const checkPageSize = (0, express_validator_1.query)('pageSize').default(10);
const checkSortBy = (0, express_validator_1.query)('sortBy').default('createdAt');
const checkSortDirection = (0, express_validator_1.query)('sortDirection').default("desc");
