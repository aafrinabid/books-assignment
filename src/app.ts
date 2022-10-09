// const stripBom = require('strip-bom-stream');
// import {stripBom} from 'strip-bom-stream'
import {parse} from 'csv-parse'
import express from 'express'
import {Request,Response} from "express"
import cors from 'cors'
import  fs from 'fs';

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const results:{title:string,ibn:string,authors:string,description:string,published:string}[]=[]
const authors:{email:string,firstname:string,lastname:string}[]=[]
const magazines:{title:string,ibn:string,authors:string,published:string,description:string}[]=[]
let totalBooks:{title:string,ibn:string,authors:string,description:string,published:string}[]=[]

const parser = parse({
    delimiter: ';'
  });
 

  const magazineParser = parse({
    delimiter: ';'
  });

  const bookParser = parse({
    delimiter: ';'
  });
  // Use the readable stream api to consume records

  // Catch any error
 


fs.createReadStream('books.csv')
.pipe(bookParser)
.on('data',(data:any)=>{
  if(data[0]==='title'){

  }else{
    const details:{ibn:string,title:string,authors:string,description:string,published:string}={
      ibn:data[1],
      title:data[0],
        authors:data[2],
        description:data[3],
        published:''
    }
    results.push(details)

  }
})
.on('end',()=>{})
.on('error',(e:any)=>console.log(e))

fs.createReadStream('authors.csv')
.pipe(parser)
.on('data',(data:any)=>{
  if(data[0]==='email'){

  }else{
    const details:{email:string,firstname:string,lastname:string}={
      email:data[0],
      firstname:data[1],
      lastname:data[2],
  }
  authors.push(details)

  }
})
.on('end',()=>{})
// .on('error',(e:any)=>console.log(e))

fs.createReadStream('magazines.csv')
.pipe(magazineParser)
.on('data',(data:any)=>{
  if(data[2]==='authors'){

  }else{
    const details:{ibn:string,title:string,authors:string,published:string,description:string}={
      ibn:data[1],
      title:data[0],
      authors:data[2],
      published:data[3],
      description:''
  }
  magazines.push(details)

  }
})
.on('end',()=>{
})
.on('error',(e:any)=>console.log(e))



app.get('/allItems',async(req:Request,res:Response)=>{
  try{
    const totalBooks=[...results,...magazines]
    const books=totalBooks.map(e=>{
      const authorData=authors.find(ele=>ele.email==e.authors)
      if(authorData!==undefined){
      const username=`${authorData.firstname} ${authorData.lastname}`
      return {...e,username}
  
      }else{
      return {...e}
  
      }
    })
    res.json(books)
  }catch(e){
console.log(e)
  }

})



app.listen(3500,()=>{
  console.log('listeneding on 3500')
})