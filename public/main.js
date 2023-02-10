const socket=io('http://localhost:3000')
// DOM FORM


let title=document.getElementById('title')
let price=document.getElementById('price')
let thumbnail=document.getElementById('thumbnail')
let submitItem=document.getElementById('submitBtn')

// filtering products

const selectPrice=document.getElementById('selectPrice')
const priceRange=document.getElementById('priceRange')

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


// RENDER CART


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
  const placeOrder=document.getElementById("placeOrder")
  placeOrder.addEventListener('click',()=>{
    const cartId={
      "cartId":placeOrder.className
  }
    fetch('api/cart/buy', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartId),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
      })
      .catch((error) => {
        console.error('Error:', error);
      });   
  })
    } catch (error){
        console.log(error)
    }
})



// TARJETAS DE PRODUCTOS //

displayProductsBtn.addEventListener('click',async()=>{
    try{
        console.log(priceRange.value)
        const queryStr=(!(selectPrice.value==="nf"))?`/api/product?price[${selectPrice.value}]=${priceRange.value}`:'/api/product/'
        console.log(queryStr)
        const fetchData=await fetch(`${queryStr}`)
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


// ESTO VIENE PEGADO DEL OTRO ARCHIVO DE MAIN //////////////////////////////////


let messages=[];
let users=[];
let products=[];

// ELEMENTOS DEL DOM

//CHAT

let chatWindow=document.getElementById('chat-window')
let sendBtn=document.getElementById('send');
let message=document.getElementById('message');
let nickname=document.getElementById('nickname');
let nicknameBtn=document.getElementById('nicknameBtn');
let chatEvents=document.getElementById('chat-events')

// EVENTOS SUBMIT PRODUCT

/*submitItem.addEventListener('click', (e)=>{
    e.preventDefault();
    let newItem={title:title.value,price:price.value,thumbnail:thumbnail.value}
    socket.emit('newItem', newItem)
})*/

// FUNCION RENDERIZAR TABLA
/*
const displayItemTable=async(items)=>{
    const template = await fetch("views/items-table.hbs");
    const templateText = await template.text();
    const templateCompiled = Handlebars.compile(templateText);
    return templateCompiled({ items });
}

socket.on("items", async (items) => {
    const template = await displayItemTable(items);
    document.getElementById("itemsContainer").innerHTML = template;
  });
  */

sendBtn.addEventListener('click', ()=>{
    let msg=(message.value);
    socket.emit('msg', msg)
})

message.addEventListener('keypress',()=>{
    socket.emit('typing', nickname.value)
})

socket.on('typing',(data)=>{
    chatEvents.innerHTML=`${data} is writing a message`
    setTimeout(()=>{
        chatEvents.innerHTML=''
    },2000)
})


socket.on('allMsgs', allMsgs => {
    clear()
    messages = allMsgs
    for (msg of allMsgs){
        paintMsg(msg)
        }
    })

const clear=()=>{
    chatWindow.innerHTML=''
}


nicknameBtn.addEventListener('click', (e)=>{
    if (!nickname.value || nickname.value===''){
        e.preventDefault()
    } else{
        let newName=nickname.value;
        let nameData={socketID:socket.id,name:newName}
        socket.emit('change-user',nameData)
        message.removeAttribute('class','hidden')
        sendBtn.removeAttribute('class','hidden')
        nicknameBtn.setAttribute('class','hidden')
        nickname.setAttribute('class','hidden')
    }
})

socket.on('allUsers', allUsers => {
    users = allUsers
    allMsgs=messages;
    clear()
    for (msg of allMsgs){
        paintMsg(msg)
    }
  })


  // sustitucion conseguir user 
const getNameBySocketId =(socket) =>{
    let foundUser=users.find((user)=>{return user.socketID===socket})
    if (foundUser)
    if (foundUser.nickname===null)
        return foundUser.socketID
    else return foundUser.nickname
}

// nuevo render

const paintMsg = (msg) => {
    const msgClass = (msg.socketID === socket.id) ? "ownMsg" : "othersMsg"
    let userNickname=getNameBySocketId(msg.socketID)
    console.log(userNickname)
    const chatOwnerContent = (msg.socketID === socket.id) ? "Me" : userNickname
    const chatMsg = document.createElement("div")
    const chatOwner = document.createElement("p")
    const chatDate = document.createElement("p")
    chatMsg.classList.add(msgClass)
    chatOwner.classList.add('nickname')
    chatDate.classList.add('time')
    chatOwner.innerHTML = chatOwnerContent
    chatDate.innerHTML = msg.time
    chatMsg.appendChild(chatOwner)
    chatMsg.innerHTML = chatMsg.innerHTML + msg.msg
    chatMsg.appendChild(chatDate)
    chatWindow.appendChild(chatMsg)
  }