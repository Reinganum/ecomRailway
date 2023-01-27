// DOM FORM

let title=document.getElementById('title')
let price=document.getElementById('price')
let thumbnail=document.getElementById('thumbnail')
let submitItem=document.getElementById('submitBtn')

// DOM PRODUCT CARDS

let productContainer=document.getElementById("productContainer")
let displayProductsBtn=document.getElementById("displayProductsBtn")


// DOM CART

let cart=document.getElementById("cart")
let createCartBtn=document.getElementById("createCartBtn")
let cartContainer=document.getElementById("cartContainer")
let cartId=document.getElementById("cartId")
let productId=document.getElementById("productId")
let addToCart=document.getElementById("addToCart")

// FORMULARIO DE INGRESO DE PRODUCTOS 

async function renderCart(data){
    console.log(data)
    const template = await fetch("views/cart-template.hbs");
    const templateText = await template.text();
    const templateCompiled = Handlebars.compile(templateText);
    return templateCompiled(data);
}

cart.addEventListener('click',async()=>{
    try{
        const fetchData=await fetch('/api/cart/')
        const cart=await fetchData.json()
        if(cart){
            console.log(cart)
            productContainer.innerHTML=await renderCart(await cart)
        if(cart.products.length>0){
            let buttonsCollection=document.getElementsByClassName('removeProductCart')
            for (let btn of buttonsCollection) {
                btn.addEventListener('click', async ()=>{
                    console.log(`CLICKED TO REMOVE PRODUCT FROM CART ${btn.id}`)
                    const productId={
                        "product":btn.id
                    }
                    fetch('api/cart/remove', {
                        method: 'POST', 
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(productId),
                      })
                        .then((response) => response.json())
                        .then((data) => {
                          let cartValue=data.cartTotal
                          let cartTotal=document.getElementById('cartTotal')
                          cartTotal.innerHTML=`${cartValue}`
                        })
                        .catch((error) => {
                          console.error('Error:', error);
                        });   
                    let rowParent =btn.parentElement.parentElement.parentElement;
                    let row=btn.parentElement.parentElement
                    rowParent.removeChild(row)
                    
                })
        }
        let emptyCartBtn=document.getElementById('emptyCartBtn')
        emptyCartBtn.addEventListener('click',async()=>{
            fetch('api/cart', {
                method: 'DELETE', 
                headers: {
                  'Content-Type': 'application/json',
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log('Success:', data);
                  productContainer.innerHTML=''
                }
                )
                .catch((error) => {
                  console.error('Error:', error);
                }); 
        })
    }
        } 
    } catch (error){
        console.log(error)
    }
})


// TARJETAS DE PRODUCTOS //

displayProductsBtn.addEventListener('click',async()=>{
    try{
        const fetchData=await fetch('/api/product/')
        const products=await fetchData.json()
        productContainer.innerHTML=await renderProducts(await products)
        if(products.length>0){
            let buttonsCollection=document.getElementsByClassName('removeProduct')
            for (let btn of buttonsCollection) {
                const data={
                    "cart":[
                        {
                            "_id":btn.id,
                        },
                    ]
                }
                btn.addEventListener('click', async ()=>{
                    try{
                        fetch('api/cart', {
                            method: 'POST', 
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data),
                          })
                            .then((response) => response.json())
                            .then((data) => {
                              let button=document.getElementById(btn.id)
                              button.innerText==="Already in cart"
                              console.log('Success:', data);
                            })
                            .catch((error) => {
                              console.error('Error:', error);
                            });   
                    }catch(error){
                        console.log("fetch failed")
                    }
                })
            }
        }
    }catch(error){
        console.log(error)
    }
})

async function renderProducts (products) {
    const archivoTemplate = await fetch("views/table-products.hbs");
    const templateText = await archivoTemplate.text();
    const templateCompiled = Handlebars.compile(templateText);
    return templateCompiled({ products });
}



