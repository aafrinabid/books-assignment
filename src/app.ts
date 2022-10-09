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

const results:{title:string,ibn:string,authors:string[],description:string,published:string,username:string}[]=[]
const authors:{email:string,firstname:string,lastname:string}[]=[]
const magazines:{title:string,ibn:string,authors:string[],published:string,description:string,username:string}[]=[]
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
    const details:{ibn:string,title:string,username:string,authors:string[],description:string,published:string}={
      ibn:data[1],
      title:data[0],
        authors:data[2].split(','),
        description:data[3],
        published:'',
        username:''
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
    const details:{ibn:string,title:string,authors:string[],username:string,published:string,description:string}={
      ibn:data[1],
      title:data[0],
      authors:data[2].split(','),
      published:data[3],
      description:'',
      username:''
  }
  magazines.push(details)

  }
})
.on('end',()=>{
})
.on('error',(e:any)=>console.log(e))



 interface Author {
  email:string,
  firstname:string,
  lastname:string
 }

app.get('/allItems',async(req:Request,res:Response)=>{
  try{
    const totalBooks=[...results,...magazines]
    let usernameArray:Author[]=[]
    const books=totalBooks.map(e=>{
      e.authors.map(ele=>{
       const fileredData= authors.find(author=>author.email===ele)
       if(fileredData!==undefined){
        usernameArray.push(fileredData)
       }
      })
      const username=usernameArray.map(e=>{
        const username=`${e.firstname} ${e.lastname}`
        return username
      })
      usernameArray=[]
      return {...e,username}
  
     
    })
    res.json(books)
  
  }catch(e){
console.log(e)
  }

}
)

app.post('/profileInfo',async(req:Request,res:Response)=>{
try{
  const totalBooks=[...results,...magazines]
  const id=req.body.id
  let userDetails:any=[]
  let usernameArray:Author[]=[]
  const books=totalBooks.map(e=>{
    let isUser
    const contains=e.authors.includes(id)
    if(contains){
 e.authors.map(ele=>{
      isUser=ele===id?true:false
      if(isUser){
        const fileredData= authors.find(author=>author.email===ele)
     if(fileredData!==undefined){
      usernameArray.push(fileredData)
     }

      }
     
    })
   
      const username=usernameArray.map(e=>{
        const username=`${e.firstname} ${e.lastname}`
        return username
      })
      usernameArray=[]
      userDetails.push({...e,username})
      return {...e,username}
  

   
    }
   
   
  })
  console.log(userDetails,'dimmmmmmmmmmmmmmmmm')
  // const userData=books.filter(e=>e!==undefined)1
  res.json(userDetails)

}catch{

}
})

app.post('/getIsbnData',(req:Request,res:Response)=>{
  try{
    console.log('inside isbn query',req.body)
    const {isbn}=req.body;
    const totalBooks=[...results,...magazines]
    const requiredData=totalBooks.filter(book=>book.ibn===isbn)
    let usernameArray:Author[]=[]
    const books=requiredData.map(e=>{
      e.authors.map(ele=>{
       const fileredData= authors.find(author=>author.email===ele)
       if(fileredData!==undefined){
        usernameArray.push(fileredData)
       }
      })
      const username=usernameArray.map(e=>{
        const username=`${e.firstname} ${e.lastname}`
        return username
      })
      usernameArray=[]
      return {...e,username}
  
    })
    res.json(books)

  }catch{

  }
})

app.listen(3500,()=>{
  console.log('listeneding on 3500')
})