const cartBtn = document.querySelector('.cart-btn')
const closeCartBtn = document.querySelector('.close-cart')
const clearCartBtn = document.querySelector('.clear-cart')
const cartDOM = document.querySelector('.cart')
const cartOverlay = document.querySelector('.cart-overlay')
const cartItems = document.querySelector('.cart-items')
const cartTotal = document.querySelector('.cart-total')
const cartContent = document.querySelector('.cart-content')
const productsDOM = document.querySelector('.products-center')
const clearCart = document.querySelector('.clear-cart')


 //simple event listener
closeCartBtn.addEventListener('click', () => {
    Cart.closeSidebar()
})

cartBtn.addEventListener('click', () => {
    Cart.openSidebar()
})

clearCart.addEventListener('click', () => {
    cart = []
    elementToDisplay = [] 
    let updadateProducts = []
/*     non capendo perchè products si modificava,nonostante nella riga 225
     abbia clonato l'array con il destracturing,
     lo ho risettato  */
    products.forEach(item=>{
        updadateProducts.push({...item,amount:1})
    })
    customProducts = [...updadateProducts]
    cartItems.innerText = 0
    cartContent.innerHTML = ''
    document.querySelectorAll('.bag-btn')
        .forEach(singleButton => singleButton.innerText = 'ADD TO BAG')
        UI.calculateTotal()
        
        
})

let cart = []

let products = []

let customProducts = []

let elementToDisplay = []

let total = ''

//products
class Products {
    static async fetchingData() {
        try {
            const response = await fetch('products.json')
            const data = await response.json()
            products = data.items
            products = products.map(item => {
                const { amount,title, price, image: { fields: { file: { url: image } } } } = item.fields;
                const { id } = item.sys
                return { title, price, id, image , amount}
            })
            return products
        }
        catch (err) {
            console.log(err)
        }
    }
}

//UI
class UI {
    static displayingProducts(products) {
        let html = ''
        products.map(product => {
            html += `
        <article class="product">
        <div class="img-container">
            <img src=${product.image} alt="product" class="product-img"/>
            <button class="bag-btn" data-id=${product.id} >
                <i class="fa fa-shopping-cart"></i>
              ADD TO BAG
            </button>
        </div>
        <h3>${product.title}</h3>
        <h4>$${product.price}</h4>
    </article>
    `
            productsDOM.innerHTML = html
        })
    }
    static startUserExperience() {
        const buttons = [...document.querySelectorAll('.bag-btn')]
        buttons.forEach(singleButton => {
            singleButton.addEventListener('click', () => {
                ButtonsDOM.addingIntoCartArray(singleButton.dataset.id)
                ButtonsDOM.numberItemsInCart()
                ButtonsDOM.changingTextButton(singleButton,singleButton.dataset.id)
                
            })
        })
    }
    static calculateTotal(){
        let newTotal = 0
        elementToDisplay.forEach(item=>{
            newTotal += item.amount * item.price
        })
       
        cartTotal.innerText =  parseFloat(newTotal.toFixed(2))
    }
}
//buttonsDOM
class ButtonsDOM {
    static addingIntoCartArray(id) {
        if (!cart.includes(id)) {
            cart.push(id)
            Cart.displayElementInCart(id)
            Cart.openSidebar()
        }
    }

    static numberItemsInCart() {
        cartItems.innerText = cart.length
    }

    static changingTextButton(singleButton,id) {
        if (cart.includes(id)) {
            singleButton.innerText = 'In cart'
        } else {
            singleButton.innerText('ADD TO BAG')
        }
    }
    //dopo riguarda questo. puoi rimuoverlo nella cart e richiamare la funzione displayElementInCart
    static removeElement (id){
        ButtonsDOM.resetAmount(id)
        let index = null
        cart.splice (cart.indexOf(`${cart.find(el=>el.id ===id)}`),1);
        elementToDisplay.forEach(item=>{
            item.id === id ? index = elementToDisplay.indexOf(item) : null
           })
        index || index == 0 ?  elementToDisplay.splice(index,1) : null;
        Cart.displayElementInCart()
        ButtonsDOM.numberItemsInCart()
        let allButtons =[...document.querySelectorAll('.bag-btn')]
       let singleButton = allButtons.find(el=>el.dataset.id === id)
       singleButton.innerText = 'ADD TO BAG'
  
       
       }
       static resetAmount(id){
        let itemToUpdate = elementToDisplay.find(el=>el.id===id)
        let amount = itemToUpdate.amount =1
        let itemUpdated = {...itemToUpdate,amount}
        elementToDisplay[itemToUpdate] = itemUpdated
      
        Cart.displayElementInCart()
        return elementToDisplay
       }
       static increaseAmount(id){
           let itemToUpdate = elementToDisplay.find(el=>el.id===id)
           let amount = itemToUpdate.amount +=1
           let itemUpdated = {...itemToUpdate,amount}
           elementToDisplay[itemToUpdate] = itemUpdated
          Cart.displayElementInCart()
         
      }
      static decreaseAmount(id){
        let itemToUpdate = elementToDisplay.find(el=>el.id===id)
        let amount = itemToUpdate.amount > 1 ? itemToUpdate.amount -=1 : 1
        let itemUpdated = {...itemToUpdate,amount}
        elementToDisplay[itemToUpdate] = itemUpdated
        Cart.displayElementInCart()

   }
}

//Cart
class Cart {
    static displayElementInCart(id) {
if(id){

    let item = customProducts.find(el => el.id === id)
    elementToDisplay.push(item)
}
UI.calculateTotal()
        let html = ``
       elementToDisplay.forEach(item=>{

           html += `
            <div class="cart-item">
            <img src=${item.image} alt="product">
            <div>
                <h4>${item.title}</h4>
                <h5>$${item.price}</h5>
                <span class="remove-item" data-id=${item.id} onclick ="ButtonsDOM.removeElement(this.dataset.id)">
                    remove
                </span>
            </div>
            <div>
                <i class="fa fa-chevron-up" data-id=${item.id} onclick = "ButtonsDOM.increaseAmount(this.dataset.id)"></i>
                <p class="item-amount">${item.amount}</p>
                <i class="fa fa-chevron-down" data-id=${item.id} onclick = "ButtonsDOM.decreaseAmount(this.dataset.id)"></i>
            </div>
            </div>
            `
       })
        cartContent.innerHTML=html
    }

    static openSidebar() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart')
    }

    static closeSidebar() {
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart')
    }

}


//loading della pagina
document.addEventListener("DOMContentLoaded", () => {

    Products.fetchingData()
        .then(products => {
            customProducts = [...products]
            UI.displayingProducts(products)
            UI.startUserExperience()
        })
})
