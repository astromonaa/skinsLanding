export class Skin {
  constructor(id, image, description, price, name) {
    this.id = id;
    this.image = image;
    this.name = name;
    this.description = description;
    this.price = price;
  }
}





export class Seller {
  constructor(skins, totalPrice, avatar, choosenSkins) {
    this.skins = skins;
    this.totalPrice = totalPrice;
    this.avatar = avatar;
    this.name = name;
    this.messages = [];
    this.choosenSkins = choosenSkins;
    this.operationType = null;
  }

  addSkin(skin) {
    this.skins.push(skin)
  }
  increasePrice(count) {
    this.totalPrice += count;
  }
  calculateTotalPrice() {
    this.skins.forEach(skin => this.totalPrice += skin.price)
  }
  setChoosenSkins(skins) {
    this.choosenSkins = skins
  }
  setOperationType(type) {
    this.operationType = type
  }
  renderChoosenSkins() {
    let renderField;
    if (this.operationType === 'give') {
      renderField = document.querySelector('.give-choosen-skins')
    }else {
      renderField = document.querySelector('.take-choosen-skins')
    }
    this.choosenSkins.forEach(skin => {
      const item = `
        <div class="choosen-skins-item" name=${skin.id}>${skin.name}</div>
      `
      renderField.insertAdjacentHTML('beforeend', item)
    })
  }
}






export class Modal {
  constructor(seller) {
    this.seller = seller;
    this.open = false;
    this.choosenSkins = []
    this.listen()
  }

  renderModalData(modalSkins) {
    modalSkins.innerHTML = ''
    this.seller.skins.forEach(skin => {
      const skinItem = `
        <div class="seller-skins__item">
          <input type="checkbox" name=${skin.id} class="modal-skin-checkbox">
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
      modalSkins.insertAdjacentHTML('beforeend', skinItem)
    })
  }

  listen() {
    document.querySelector('.trades__item__bottom').addEventListener('click', event => this.onModalOpen(event))
    document.querySelector('.modal-close').addEventListener('click', () => this.onModalClose())
    document.querySelector('.modal-user-skins').addEventListener('click', event => this.onSkinChoose(event))
    document.querySelector('.skin-add-button').addEventListener('click', () => this.onAddChoosenSkins())
  }
  onModalOpen(event) {
    if (event.target.classList.contains('modal-open-icon')) {
      this.seller.setOperationType(event.target.name)
      this.open = true;
      this.updateView()
    }
  }
  onModalClose() {
    this.open = false;
    this.updateView()
  }
  onSkinChoose(event) {
    if (event.target.classList.contains('modal-skin-checkbox')) {
      const skin = this.seller.skins.find(el => el.id === Number(event.target.name))
      this.choosenSkins.push(skin)
    }
  }
  onAddChoosenSkins() {
    this.seller.setChoosenSkins(this.choosenSkins)
    this.seller.renderChoosenSkins()
    this.open = false
    this.updateView()
    this.choosenSkins = []
  }
  updateView() {
    const modal = document.querySelector('.modal-wrapper');
    const modalSkins = modal.querySelector('.modal-user-skins')
    if (this.open) {
      this.renderModalData(modalSkins)
      modal?.classList.add('visible-modal-wrapper')
    }else {
      modal?.classList.remove('visible-modal-wrapper')
    }
  }
}


export class Chat {
  constructor(user) {
    this.user = user;
    this.userMessage = '';
    this.listen()
  }

  listen() {
    const messageInput = document.getElementById('message-input')
    messageInput.addEventListener('input', event => this.onMessageInputChange(event))
    messageInput.addEventListener('keydown', event => this.onMessageSend(event))
  }
  onMessageInputChange(event) {
    this.userMessage = event.target.value;
  }
  onMessageSend(event) {
    if (event.key === 'Enter' && this.userMessage.trim().length) {
      const messagesBlock = document.querySelector('.chat-messages')
      const message = this.getUserMessage()
      messagesBlock.insertAdjacentHTML('beforeend', message)
      messagesBlock.scrollTo({top: messagesBlock.scrollHeight, behavior: 'smooth'})
      event.target.value = ''
    }
  }
  getUserMessage() {
    const message = `
      <div class="message-item">
        <div class="message-item__top">
          <img src="./assets/seller.png" alt="seller">
          <span>Path</span>
          <button class="my-button">Trade</button>
        </div>
        <div class="message-text">${this.userMessage} </div>
        <div class="offer-skins">
          ${this.getOfferSkins()}
        </div>
      </div>
    `
    return message
  }
  getOfferSkins() {
    const skins = [];
    this.user.choosenSkins.forEach(skin => {
      const skinItem = `
        <div class="seller-skins__item">
          <input type="checkbox" name="" id="" class="modal-skin-checkbox">
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
      skins.push(skinItem)
    })
    return skins.join('')
  }
}