const cards = document.getElementById('cards')
const items = document.getElementById('items')
const tableFooter = document.getElementById('table-footer')
const templateCards = document.getElementById('template-cards').content
const templateFooter = document.getElementById('template-footer-table').content
const templateCart = document.getElementById('template-cart-table').content
const fragment = document.createDocumentFragment()
let objCart = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})
cards.addEventListener('click', e => {
    addCart(e)
})

items.addEventListener('click', e => {
    btnAction(e)
})

const fetchData = async () => {
    try{
        const res = await fetch('api.json')
        const data = await res.json()
        showCards(data)
    } catch(error) {
        console.log(error)
    }
}

const showCards = data => {
    data.forEach(products => {
        templateCards.querySelector('#title-card').textContent = products.title
        templateCards.querySelector('#p-card').textContent = products.price
        templateCards.querySelector('#img-card').setAttribute("src", products.thumbnailUrl)
        templateCards.querySelector('#btn-card').dataset.id = products.id

        const clone = templateCards.cloneNode(true)
        fragment.appendChild(clone)
    });

    cards.appendChild(fragment)
}

const addCart = e => {
    if(e.target.classList.contains('btn-card')){
        setObjCart(e.target.parentElement)
    }
    e.stopPropagation()
}

const setObjCart = objt => {
    const objProduct = {
        id: objt.querySelector('#btn-card').dataset.id,
        title: objt.querySelector('#title-card').textContent,
        price: objt.querySelector('#p-card').textContent,
        amount: 1
    }

    if (objCart.hasOwnProperty(objProduct.id)) {
        objProduct.amount = objCart[objProduct.id].amount + 1
    }

    objCart[objProduct.id] = {...objProduct}
    showCart()
}

const showCart = () => {
    items.innerHTML = ''

    Object.values(objCart).forEach(objProduct => {
        templateCart.querySelector('th').textContent = objProduct.id
        templateCart.querySelectorAll('td')[0].textContent = objProduct.title
        templateCart.querySelectorAll('td')[1].textContent = objProduct.amount
        templateCart.querySelector('#price-total-table').textContent = objProduct.amount * objProduct.price

        templateCart.querySelector('#btn-add-item').dataset.id = objProduct.id
        templateCart.querySelector('#btn-delete-item').dataset.id = objProduct.id

        const clone = templateCart.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)

    showTableFooter()
}

const showTableFooter = () =>{
    tableFooter.innerHTML = ''
    if (Object.keys(objCart).length === 0 ) {
        tableFooter.innerHTML =`
        <th scope="row" colspan="5">Empty cart!</th>
        `
        return
    }

    const nAmount = Object.values(objCart).reduce((acc, {amount}) => acc + amount,0)
    const nPrice = Object.values(objCart).reduce((acc, {amount, price}) => acc + amount * price,0)

    templateFooter.querySelectorAll('td')[0].textContent = nAmount
    templateFooter.querySelector('#price-all-total').textContent = nPrice

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    tableFooter.appendChild(fragment)

    const btnEmptyCart = document.getElementById('empty-cart')
    btnEmptyCart.addEventListener('click', () =>{
        objCart = {}
        console.log(objCart)
        showCart()
    })
    console.log(btnEmptyCart)
}

const btnAction = e =>{
    if (e.target.classList.contains('btn-add')) {
        const productAction = objCart[e.target.dataset.id]
        productAction.amount++

        objCart[e.target.dataset.id] = {...productAction}
        showCart()
    }

    if (e.target.classList.contains('btn-delete')) {
        const productAction = objCart[e.target.dataset.id]
        productAction.amount--
        if (productAction.amount === 0){
            delete objCart[e.target.dataset.id]
            
        }else{
            objCart[e.target.dataset.id]={...productAction}
        }
        showCart()
    }

    e.stopPropagation()
}