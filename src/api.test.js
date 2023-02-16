const request = require('supertest');
const Response = require('twilio/lib/http/response');
const expect=require('chai').expect
const app = require('./server');

describe('TESTING PRODUCT ROUTE', function(){
    it('delete all returns amount of removed objects',async function(){
        const arr=await request(app).get('/api/product/')
        const arrLength=await (arr.body.length)
        const response=await request(app).delete('/api/product/')
        expect(response.text).to.equal(JSON.stringify({
            acknowledged: true,
            deletedCount: arrLength
        }))
        expect(response.status).to.equal(200)
    })
    it('saved product returns product as DTO',async function(){
        const newProduct={
            "title":"caligula",
            "description":"perpendicular",
            "price": 3000,
            "quantity":10,
            "category":"cine",
            "thumbnail":"fotito"
        }
        const savedProduct={
            "title": "caligula",
            "price": 3000,
            "quantity":10,
            "thumbnail": "fotito",
            "description": "perpendicular"
        }
        const response=await request(app).post('/api/product/').send(newProduct)
        expect(response.text).to.equal(JSON.stringify(savedProduct))
        expect(response.status).to.equal(200)
    })
    it('saving product with missing fields returns error',async function(){
        const newProduct={
            "title":"clavicordio"
        }
        const response=await request(app).post('/api/product/').send(newProduct)
        expect(response.status).to.equal(406)
    })
    it('product is in storage array',async function(){
        const response=await request(app).get('/api/product/')
        expect(response.body.length).to.equal(1)
    })
    it('adding second product',async function(){
        const newProduct={
            "title":"tramontino",
            "description":"perpendicular",
            "price": 3000,
            "quantity":10,
            "category":"cine",
            "thumbnail":"fotito"
        }
        const response=await request(app).post('/api/product/').send(newProduct)
        expect(response.status).to.equal(200)
    })
    it('get all trae ambos productos',async function(){
        const response=await request(app).get('/api/product/')
        expect(response.body.length).to.equal(2)
        expect(response.status).to.equal(200)
    })
    it('wrong id format returns error in get route', async function(){
        const response=await request(app).get('/api/product/aaaaaaa')
        expect(response.body.error).to.equal("this ID is invalid or object is not found")
        expect(response.status).to.equal(404)
    })
    it('wrong id format returns error in put route', async function(){
        const response=await request(app).put('/api/product/.[,958')
        expect(response.body.error).to.equal("this ID is invalid or object is not found")
        expect(response.status).to.equal(404)
    })
    it('wrong id format returns error in delete route', async function(){
        const response=await request(app).delete('/api/product/0')
        expect(response.body.error).to.equal("this ID is invalid or object is not found")
        expect(response.status).to.equal(404)
    })
    it('update route changes property as expected',async function(){
        const update={"title":"BABAYAGA"}
        const response=await request(app).put('/api/product/1').send(update)
        expect(response.body.title).to.equal("BABAYAGA")
    })
    it('deleting product by id returns deleted object',async function(){
        const response=await request(app).delete('/api/product/1')
        expect(response.body).to.deep.equal({title: 'BABAYAGA',description: 'perpendicular',price: 3000,quantity: 10,category: 'cine',thumbnail: 'fotito',slug: 'BABAYAGA',id: 1})
        expect(response.status).to.equal(200)
    })
    it('delete all returns amount of removed objects',async function(){
        const arr=await request(app).get('/api/product/')
        const arrLength=await (arr.body.length)
        const response=await request(app).delete('/api/product/')
        expect(response.text).to.equal(JSON.stringify({
            acknowledged: true,
            deletedCount: arrLength
        }))
        expect(response.status).to.equal(200)
    })
    it('get all returns empty array',async function(){
        const response1=await request(app).delete('/api/product/')
        if (await response1){
            const response=await request(app).get('/api/product/')
            expect(response.body).to.deep.equal([])
            expect(response.status).to.equal(200)}
    })
})

