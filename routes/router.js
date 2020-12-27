const express = require('express')
const router = express.Router()
const pool = require('../lib/pool/index')
const bodyParser = require('body-parser')
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended:true}))
router.get('/products',(req,res)=>{
    pool.getConnection((err,PoolConnection)=>{
        if (err) throw err
        let q = `SELECT * FROM products`
        PoolConnection.query(q,(error,rows,field)=>{
          if(error) throw error
          return res.status(200).send({data:rows})
        })
        PoolConnection.release()
    })
})

router.get('/products/?:id',(req,res)=>{
    pool.getConnection((err,PoolConnection)=>{
        if(err) throw err
        let q = `SELECT * FROM products WHERE id = ${PoolConnection.escape(req.params.id)}`
        PoolConnection.query(q,(error,rows,fields)=>{
            if (error) throw error
            if(rows.length > 0){
                return res.status(200).send({data:rows[0]})
            }else{
                return res.status(404).send({error: 'not found'})
            }
        })
        PoolConnection.release()
    })
})

router.post('/products',(req,res)=>{
    pool.getConnection((error,connection)=>{
        if(error) throw error
        let q = `INSERT INTO products (name,price) VALUES (${connection.escape(req.body.name)},${connection.escape(req.body.price)})`
        connection.query(q,(err,rows,fields)=>{
            if(err) throw err
            const newId = rows.insertId
            let q1 = `SELECT * FROM products WHERE id = ${connection.escape(newId)}`
            connection.query(q1,(err,rows,fields)=>{
                if(err) throw err
                res.status(201)
                res.send({data:rows[0]})
            })
        })
        connection.release()
    })
})

module.exports = router