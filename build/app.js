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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const stripBom = require('strip-bom-stream');
// import {stripBom} from 'strip-bom-stream'
const csv_parse_1 = require("csv-parse");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const results = [];
const authors = [];
const magazines = [];
let totalBooks = [];
const parser = (0, csv_parse_1.parse)({
    delimiter: ';'
});
const magazineParser = (0, csv_parse_1.parse)({
    delimiter: ';'
});
const bookParser = (0, csv_parse_1.parse)({
    delimiter: ';'
});
// Use the readable stream api to consume records
// Catch any error
fs_1.default.createReadStream('books.csv')
    .pipe(bookParser)
    .on('data', (data) => {
    if (data[0] === 'title') {
    }
    else {
        const details = {
            ibn: data[1],
            title: data[0],
            authors: data[2].split(','),
            description: data[3],
            published: '',
            username: ''
        };
        results.push(details);
    }
})
    .on('end', () => { })
    .on('error', (e) => console.log(e));
fs_1.default.createReadStream('authors.csv')
    .pipe(parser)
    .on('data', (data) => {
    if (data[0] === 'email') {
    }
    else {
        const details = {
            email: data[0],
            firstname: data[1],
            lastname: data[2],
        };
        authors.push(details);
    }
})
    .on('end', () => { });
// .on('error',(e:any)=>console.log(e))
fs_1.default.createReadStream('magazines.csv')
    .pipe(magazineParser)
    .on('data', (data) => {
    if (data[2] === 'authors') {
    }
    else {
        const details = {
            ibn: data[1],
            title: data[0],
            authors: data[2].split(','),
            published: data[3],
            description: '',
            username: ''
        };
        magazines.push(details);
    }
})
    .on('end', () => {
})
    .on('error', (e) => console.log(e));
app.get('/allItems', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalBooks = [...results, ...magazines];
        let usernameArray = [];
        const books = totalBooks.map(e => {
            e.authors.map(ele => {
                const fileredData = authors.find(author => author.email === ele);
                if (fileredData !== undefined) {
                    usernameArray.push(fileredData);
                }
            });
            const username = usernameArray.map(e => {
                const username = `${e.firstname} ${e.lastname}`;
                return username;
            });
            usernameArray = [];
            return Object.assign(Object.assign({}, e), { username });
        });
        res.json(books);
    }
    catch (e) {
        console.log(e);
    }
}));
app.post('/profileInfo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalBooks = [...results, ...magazines];
        const id = req.body.id;
        let userDetails = [];
        let usernameArray = [];
        const books = totalBooks.map(e => {
            let isUser;
            const contains = e.authors.includes(id);
            if (contains) {
                e.authors.map(ele => {
                    isUser = ele === id ? true : false;
                    if (isUser) {
                        const fileredData = authors.find(author => author.email === ele);
                        if (fileredData !== undefined) {
                            usernameArray.push(fileredData);
                        }
                    }
                });
                const username = usernameArray.map(e => {
                    const username = `${e.firstname} ${e.lastname}`;
                    return username;
                });
                usernameArray = [];
                userDetails.push(Object.assign(Object.assign({}, e), { username }));
                return Object.assign(Object.assign({}, e), { username });
            }
        });
        console.log(userDetails, 'dimmmmmmmmmmmmmmmmm');
        // const userData=books.filter(e=>e!==undefined)1
        res.json(userDetails);
    }
    catch (_a) {
    }
}));
app.post('/getIsbnData', (req, res) => {
    try {
        console.log('inside isbn query', req.body);
        const { isbn } = req.body;
        const totalBooks = [...results, ...magazines];
        const requiredData = totalBooks.filter(book => book.ibn === isbn);
        let usernameArray = [];
        const books = requiredData.map(e => {
            e.authors.map(ele => {
                const fileredData = authors.find(author => author.email === ele);
                if (fileredData !== undefined) {
                    usernameArray.push(fileredData);
                }
            });
            const username = usernameArray.map(e => {
                const username = `${e.firstname} ${e.lastname}`;
                return username;
            });
            usernameArray = [];
            return Object.assign(Object.assign({}, e), { username });
        });
        res.json(books);
    }
    catch (_a) {
    }
});
app.listen(3500, () => {
    console.log('listeneding on 3500');
});
