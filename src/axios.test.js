const expect=require('chai').expect
const app = require('./server');
const axios=require('axios')

axios.defaults.baseURL='http://localhost:3000/api/product'


const deleteAll=()=>axios.delete('/')
const getAll=()=>axios.get('/')
const save=(product)=>axios.post('/',product)
const getById=(id)=>axios.get(`/${id}`)
const deleteById=(id)=>axios.delete(`/${id}`)
const updateById=(id,update)=>axios.put(`/${id}`,update)

describe('console log', function(){
    it('Delete all aknowledges and gives propper deleteCount',async function(){
        const allProducts=await getAll()
        const productLength=allProducts.data.length
        const response =await deleteAll()
        expect(response.data).to.deep.equal({ acknowledged: true, deletedCount: productLength })
        expect(response.status).to.equal(200)
    })
    it('Get all will return empty array',async function(){
        const response =await getAll()
        expect(response.data).to.deep.equal([])
        expect(response.status).to.equal(200)
    })
    it('Saving new product returns product data as DTO',async function(){
        const newProduct={"title":"caligula","description":"perpendicular","price": 3000,"quantity":10,"category":"cine","thumbnail":"fotito"}
        const response =await save(newProduct)
        expect(response.data).to.deep.equal({
            "title": "caligula",
            "price": 3000,
            "quantity":10,
            "thumbnail": "fotito",
            "description": "perpendicular"
        })
        expect(response.status).to.equal(200)
    })
    it('product is in storage array',async function(){
        const response=await getAll()
        expect(response.data.length).to.equal(1)
    })
    it('saving product with missing fields returns error',async function(){
        const newProduct={"title":"clavicordio"}
        let response=null
        try{
            response=await save(newProduct)
        } catch (error){
            response=error.response.status
        }
        expect(response).to.equal(406)
    })
    it('can add more products and return correct DTO of new product',async function(){
        const newProduct={"title":"epicondilo","description":"cagliostro","price": 5000,"quantity":15,"category":"cine","thumbnail":"grabado"}
        const response =await save(newProduct)
        expect(response.data).to.deep.equal({
            "title": "epicondilo",
            "price": 5000,
            "quantity":15,
            "thumbnail": "grabado",
            "description": "cagliostro"
        })
        expect(response.status).to.equal(200)
    })
    it('get all brings all items',async function(){
        const response=await getAll()
        expect(response.data.length).to.equal(2)
        expect(response.status).to.equal(200)
    })
    it('wrong id format returns error in get route', async function(){
        let response=null
        try{
            response=await getById("a")
        } catch (error){
            response=error.response.status
        }
        expect(response).to.equal(404)
    })
    it('wrong id format returns error in update product route', async function(){
        let response=null
        try{
            response=await updateById(".[,958")
        } catch (error){
            response=error.response.status
        }
        expect(response).to.equal(404)
    })
    it('wrong id format returns error in delete by id route', async function(){
        let response=null
        try{
            response=await deleteById(0)
        } catch (error){
            response=error.response.status
        }
        expect(response).to.equal(404)
    })
    it('update route changes property as expected',async function(){
        const update={"title":"BABAYAGA"}
        const response=await updateById(1,update)
        expect(response.data.title).to.equal("BABAYAGA")
    })
    it('deleting product by id returns deleted object',async function(){
        const response=await deleteById(1)
        expect(response.data).to.deep.equal({title: 'BABAYAGA',description: 'perpendicular',price: 3000,quantity: 10,category: 'cine',thumbnail: 'fotito',slug: 'BABAYAGA',id: 1})
        expect(response.status).to.equal(200)
    })
    it('delete all returns amount of removed objects',async function(){
        const allProducts=await getAll()
        const productLength=allProducts.data.length
        const response =await deleteAll()
        expect(response.data).to.deep.equal({ acknowledged: true, deletedCount: productLength })
        expect(response.status).to.equal(200)
    })
    it('Get all will return empty array',async function(){
        const response =await getAll()
        expect(response.data).to.deep.equal([])
        expect(response.status).to.equal(200)
    })
})