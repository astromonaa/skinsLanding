import '../styles/styles.css'
import '../styles/ui.css'
import { initData } from '../utils/initData'
import { Seller, Skin, Modal, Chat, TradeBoard } from './main'

import tradesItem from '../assets/trades-item-package.svg'
import Polygon from '../assets/Polygon.svg'
import Search from '../assets/search.svg'
import Exchange from '../assets/exchange.svg'
import AddIcon from '../assets/add.svg'
import CloseIcon from '../assets/close.svg'
import smileIcon from '../assets/smile.svg'


class App {
  constructor(initData) {
    this.initData = initData
    this.sellers = [];
    this.user = null;
    this.modal = null;
    this.chat = null;
    this.tradeBoard = null;
    this.init()
  }

  init() {
    this.initData.forEach(sellerItem => {
      const seller = new Seller([], 0, sellerItem.avatar)
      sellerItem.skins.forEach(skinItem => {
        const skin = new Skin(skinItem.id, skinItem.image, skinItem.description, skinItem.price, skinItem.name)
        seller.addSkin(skin)
        seller.increasePrice(skinItem.price)
      })
      this.sellers.push(seller)
    })
    this.user = new Seller(this.sellers[0].skins, 0, this.sellers[0].avatar, [])
    this.user.calculateTotalPrice()
    this.modal = new Modal(this.user)
    this.chat = new Chat(this.user)
    this.tradeBoard = new TradeBoard(this.user)
  }
  renderData() {
    this.sellers.forEach(seller => {
      const sellerItem = document.createElement('div')
      const sellerItemTop = document.createElement('div')
      const selleraAvatar = document.createElement('img')
      const sellerPath = document.createElement('span')
      const tradeButton = document.createElement('button')
      const sellerPrice = document.createElement('div')
      const currency = document.createElement('span')
      const priceValue = document.createElement('span')
      const sellerSkins = document.createElement('div')

      sellerItem.classList.add('seller-item')
      sellerItemTop.classList.add('seller-item__top')
      selleraAvatar.setAttribute('src', seller.avatar)
      sellerPath.innerHTML = 'Path'
      tradeButton.classList.add('my-button')
      tradeButton.innerHTML = 'Trade'

      sellerPrice.classList.add('seller-item__top__price')
      currency.innerHTML = '&#x24;'
      priceValue.innerHTML = seller.totalPrice.toLocaleString('ru')
      sellerSkins.classList.add('seller-skins')

      sellerPrice.insertAdjacentElement('beforeend', currency)
      sellerPrice.insertAdjacentElement('beforeend', priceValue)

      sellerItemTop.insertAdjacentElement('beforeend', selleraAvatar)
      sellerItemTop.insertAdjacentElement('beforeend', sellerPath)
      sellerItemTop.insertAdjacentElement('beforeend', tradeButton)
      sellerItemTop.insertAdjacentElement('beforeend', sellerPrice)

      sellerItem.insertAdjacentElement('beforeend', sellerItemTop)
      sellerItem.insertAdjacentElement('beforeend', sellerSkins)

      seller.skins.forEach(skin => {
        const skinItem = `
          <div class="seller-skins__item">
            <img src=${skin.image} alt="skin">
            <div class="skin-desc">
              <span>${skin.description[0]}</span> /
              <span>${skin.description[1]}</span>
              <span>${skin.description[2] ? `/ ${skin.description[2]}` : ''}</span>
            </div>
            <div class="skin-price">
              <span> &#x24;</span>
              <span>${skin.price.toLocaleString('ru')}</span>
            </div>
          </div>
        `
        sellerItem.querySelector('.seller-skins').insertAdjacentHTML('beforeend', skinItem)
      })
      document.querySelector('.products-block').insertAdjacentElement('beforeend', sellerItem)
    })
  }
}

if (!window.app) {
  window.app = new App(initData)
  window.app.renderData()
}
