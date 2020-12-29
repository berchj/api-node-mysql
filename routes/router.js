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

router.put('/products/:id',(req,res)=>{
    pool.getConnection((error,connection)=>{
        if (error) throw error
        let q = `SELECT * FROM products WHERE id = ${connection.escape(req.params.id)}`
        connection.query(q,(error,rows,fields)=>{
            if(error) throw error
            if(rows.length > 0){
                let q1 = [`UPDATE products SET name = ${connection.escape(req.body.name)} WHERE id = ${connection.escape(req.params.id)}`,`UPDATE products SET price = ${connection.escape(req.body.price)} WHERE id = ${connection.escape(req.params.id)}`]
                connection.query(q1.join(';'),(error,rows,fields)=>{
                    if(error) throw error
                    let q2 = `SELECT * FROM products WHERE id = ${connection.escape(req.params.id)}`                    
                    connection.query(q2,(error,rows,fields)=>{
                        res.status(200)
                        res.send({resourse_updated: rows[0]})
                    })
                })
            }else{
                res.status(404)
                res.send({message:'error not found'})
            }
        })
    })
})

router.delete('/products/:id',(req,res)=>{
    pool.getConnection((error,connection)=>{
        if(error) throw error
        let q = `SELECT * FROM products WHERE id = ${connection.escape(req.params.id)}`
        connection.query(q,(error,rows,fields)=>{
            if (error) throw error
            if(rows.length > 0){
                let q1 = `DELETE FROM products WHERE id = ${connection.escape(req.params.id)}`                
                connection.query(q1,(error,rows,fields)=>{
                    res.status(200)
                    res.send({resourse_deleted:rows[0]}) 
                })
            }else{
                res.status(404)
                res.send({message:'error not found'})
            }
        })
    })
})



module.exports = router
