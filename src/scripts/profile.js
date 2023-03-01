import { messages } from "../utils/userMessages";

export class Profile {
  constructor(user) {
    this.user = user;
    this.messagesList = document.querySelector('.profile-messages-list')
    this.sliderControls = document.querySelector('.slider-controls')
    this.inventoryBlock = document.querySelector('.inventory__skins')
    this.inventorySkinsPrice = document.querySelector('.inventory-skins__price')
    this.toLeft = messages.length - 2;
    this.toRight = 0;
    this.init()
    this.listen()
  }
  init(){
    messages.forEach((message, idx) => {
      const msgClass = this.getMsgClass(idx)
      const msg = {...message, skins: this.user.skins.slice(0, 4), class: msgClass}
      this.user.addMessage(msg)
    })
    this.updateMessagesView()
    this.fillInventory()
  }
  listen() {
    this.sliderControls.addEventListener('click', event => this.switchSlider(event))
  }
  switchSlider(event) {
    if (event.target.classList.contains('slider-left') && this.toLeft > 0) {
      this.sliderLeft()
      this.toLeft -= 1;
      this.toRight += 1
    }else if (event.target.classList.contains('slider-right') && this.toRight > 0) {
      this.slideRight()
      this.toRight -= 1;
      this.toLeft += 1;
    }
  }
  sliderLeft() {
    this.user.messages.map(el => {
      if (el.class === 'current' ){
        el.class = 'prev'
      }else if (el.class === 'second') {
        el.class = 'current'
      }else if (el.class === 'next') {
        el.class = 'second'
      }else if (el.class === 'prev') {
        el.class = 'next'
      }else {
        return el
      }
    })
    this.updateSwitchSlides()
  }
  slideRight() {
    this.user.messages.map(el => {
      if (el.class === 'second' ){
        el.class = 'next'
      }else if (el.class === 'current') {
        el.class = 'second'
      }else if (el.class === 'prev') {
        el.class = 'current'
      }else if (el.class === 'left') {
        el.class = 'prev'
      }else {
        return el
      }
    })
    this.updateSwitchSlides()
  }
  getMsgClass(idx) {
    let msgClass = '';
    if (this.user.messages.length === 3) {
      if (idx === 0) {
        msgClass = 'current'
      }else if (idx === 1) {
        msgClass = 'second'
      }else if (idx === 2) {
        msgClass = 'next'
      }
    }else {
      if (idx === 0) {
        msgClass = 'current'
      }else if (idx === 1) {
        msgClass = 'second'
      }else if (idx === 2) {
        msgClass = 'next'
      }else {
        msgClass.class === 'last'
      }
    }
    return msgClass
  }
  updateMessagesView() {
    this.messagesList.innerHTML = ''
    this.user.messages.forEach(msg => this.messagesList.insertAdjacentHTML('beforeend', this.getMessageRenderHTML(msg)))
  }
  fillInventory() {
    this.user.skins.forEach(skin => this.inventoryBlock.insertAdjacentHTML('beforeend', this.getInventorySkinHTML(skin)))
    this.inventorySkinsPrice.innerHTML = this.user.totalPrice.toLocaleString('ru')
  }
  updateSwitchSlides() {
    const slides = [...document.querySelectorAll('.profile-message__item')]
    slides.map(slide => {
      const arrayItem = this.user.messages.find(el => el.id == slide.dataset.id);
      slide.className = "profile-message__item"
      slide.classList.add(arrayItem.class)
    })
  }
  getInventorySkinHTML(skin) {
    return `
    <div class="seller-skins__item">
      <img src=${skin.image} alt="skin">
      <div class="skin-desc">
        <span>${skin.description[0]}</span> /
        <span>${skin.description[1]}</span>
        <span>${skin.description[2] ? `/ ${skin.description[2]}` : ''}</span>
      </div>
      <div class="skin-price">
        <span>&#x24;</span>
        <span>${skin.price.toLocaleString('ru')}</span>
      </div>
    </div>
    `
  }
  getMessageRenderHTML(msg) {
    return  `
    <div class="profile-message__item ${msg.class}" data-id=${msg.id}>
      <div class="message-date">
        <span class="date">06.01.2023</span>
        <span class="time">14:56</span>
      </div>
      <div class="message-text">${msg.text}</div>
      <div class="message-skins">
        ${this.getSkinsRenderHTML(msg)}
      </div>
    </div>
    `
  }
  getSkinsRenderHTML(msg) {
    const skins = []
    msg.skins.forEach(skin => {
      const html = `
        <div class="seller-skins__item">
          <img src=${skin.image} alt="skin">
          <div class="skin-desc">
            <span>${skin.description[0]}</span> /
            <span>${skin.description[1]}</span>
            <span>${skin.description[2] ? `/ ${skin.description[2]}` : ''}</span>
          </div>
          <div class="skin-price">
            <span>&#x24;</span>
            <span>${skin.price.toLocaleString('ru')}</span>
          </div>
        </div> 
      `
      skins.push(html)
    })
    return skins.join('')
  }
}