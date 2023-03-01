import whiteClose from '../assets/white-close.svg'

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
  constructor(skins, totalPrice, avatar) {
    this.skins = skins;
    this.totalPrice = totalPrice;
    this.avatar = avatar;
    this.name = name;
    this.messages = [];
    this.choosenSkins = [];
    this.offerSkins = []
    this.operationType = null;
    this.messages = []
    this.tradeBoard = null;
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
  addChoosenSkin(event) {
    const skin = this.skins.find(el => el.id === Number(event.target.name))
    this.choosenSkins.push(skin)
  }
  removeFromChoosenSkins(event) {
    this.choosenSkins = this.choosenSkins.filter(el => el.id !== Number((event.target.name)))
  }
  addOfferSkin(event) {
    const skin = this.skins.find(el => el.id === Number(event.target.name))
    this.offerSkins.push(skin)
  }
  removeFromOfferSkins(event) {
    this.offerSkins = this.offerSkins.filter(el => el.id !== Number((event.target.name)))
  }
  addMessage(message) {
    this.messages.push(message)
  }
  clearChoosenSkin() {
    this.choosenSkins = []
  }
  clearOfferSkins() {
    this.offerSkins = []
  }
  setOperationType(type) {
    this.operationType = type
  }
  setTradeBoard(board) {
    this.tradeBoard = board
  }
  renderChoosenSkins() {
    let renderField;
    if (this.operationType === 'give') {
      renderField = document.querySelector('.give-choosen-skins')
    } else {
      renderField = document.querySelector('.take-choosen-skins')
    }
    renderField.innerHTML = ''
    this.choosenSkins.forEach(skin => {
      const item = `
        <div class="choosen-skins-item">
          ${skin.name}
          <div name=${skin.id} class="choosen-remove">
            <img name=${skin.id} src=${whiteClose}/>
          </div>
        </div>
      `
      renderField.insertAdjacentHTML('beforeend', item)
    })
  }
}






export class Modal {
  constructor(seller) {
    this.seller = seller;
    this.open = false;
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
      this.seller.clearChoosenSkin()
      this.open = true;
      this.updateView()
    }else if (event.target.classList.contains('choosen-remove') || event.target.parentElement.classList.contains('choosen-remove')) {
      this.seller.removeFromChoosenSkins(event)
      this.seller.renderChoosenSkins()
    }
  }
  onModalClose() {
    this.open = false;
    this.updateView()
  }
  onSkinChoose(event) {
    if (event.target.classList.contains('modal-skin-checkbox')) {
      this.seller.addChoosenSkin(event)
    }
  }
  onAddChoosenSkins() {
    this.seller.renderChoosenSkins()
    this.open = false
    this.updateView()
  }
  updateView() {
    const modal = document.querySelector('.modal-wrapper');
    const modalSkins = modal.querySelector('.modal-user-skins')
    if (this.open) {
      this.renderModalData(modalSkins)
      modal?.classList.add('visible-modal-wrapper')
    } else {
      modal?.classList.remove('visible-modal-wrapper')
    }
  }
}





export class Chat {
  constructor(user) {
    this.user = user;
    this.userMessage = '';
    this.messageInput = document.getElementById('message-input')
    this.listen()
  }

  listen() {
    this.messageInput.addEventListener('input', event => this.onMessageInputChange(event))
    this.messageInput.addEventListener('keydown', event => this.onMessageSend(event))
  }
  onMessageInputChange(event) {
    this.userMessage = event.target.value;
  }
  onMessageSend(event) {
    if (event.key === 'Enter' && this.userMessage.trim().length) {
      const message = {text: this.userMessage, skins: this.user.skins}
      this.user.addMessage(message)
      this.userMessage = ''
      this.updateView(event)
      this.user.clearOfferSkins()
      this.user.tradeBoard.updateSelectDropList()
      this.user.tradeBoard.updateSelectTopNames()
    }
  }
  updateView(event) {
    const messagesBlock = document.querySelector('.chat-messages')
    messagesBlock.insertAdjacentHTML('beforeend', this.getUserMessage())
    messagesBlock.scrollTo({ top: messagesBlock.scrollHeight, behavior: 'smooth' })
    event.target.value = this.userMessage
  }
  getUserMessage() {
    const message = `
      <div class="message-item">
        <div class="message-item__top">
          <img src="./assets/seller.png" alt="seller">
          <span>Path</span>
          <button class="my-button">Trade</button>
        </div>
        <div class="message-text">${this.user.messages[this.user.messages.length - 1].text} </div>
        <div class="offer-skins">
          ${this.getOfferSkins()}
        </div>
      </div>
    `
    return message
  }
  getOfferSkins() {
    const skins = [];
    this.user.offerSkins.forEach(skin => {
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







export class TradeBoard {
  constructor(user) {
    this.user = user;
    this.dropdown = document.querySelector('.dropdown')
    this.searchInput = document.querySelector('#skins-seacrh-input')
    this.range = document.querySelector('.line-wrapper')
    this.lineCoords = this.range.getBoundingClientRect()
    this.select = document.querySelector('.trades__item__middle__select')
    this.selectedList = document.querySelector('.select')
    this.mouse = {
      x: 0,
      left: false,
      startX: 0,
    }
    this.pointParams = {
      startX: 0,
    }
    this.catchPoint = null;
    this.isPoint = false;
    this.selectOpen = false;
    this.listen()
  }

  listen() {
    this.searchInput.addEventListener('input', event => this.onSkinSearch(event))
    this.dropdown.addEventListener('click', event => this.onDropdownClick(event))
    this.range.addEventListener('mousedown', event => this.onRangeMouseDown(event))
    this.select.addEventListener('click', event => this.onSelectOpen(event))
    this.selectedList.addEventListener('click', event => this.onSelectItemChoose(event))

    document.addEventListener('mousemove', event => this.onMouseMove(event))
    document.addEventListener('mouseup', event => this.onMouseUp(event))
    document.querySelector('.quality-items').addEventListener('click', event => this.onQualityChoose(event))
  }
  onMouseMove(event) {
    this.mouse.x = event.clientX;
    if (this.mouse.left && this.isPoint) {
      this.onRangeMouseMove()
    }
  }
  onRangeMouseMove() {
    let points = document.querySelectorAll('.line__circle')
    const leftPoint = document.querySelector('.left__point')
    const rightPoint = document.querySelector('.right__point')
    let distanceToNearest;
    points = [...points].filter(el => el.getBoundingClientRect().x > leftPoint.getBoundingClientRect().x && el.getBoundingClientRect().x < rightPoint.getBoundingClientRect().x)

    if (this.catchPoint.classList.contains('left__point')) {
      let nearest = points.sort((a, b) => a.getBoundingClientRect().x - leftPoint.getBoundingClientRect().x < b.getBoundingClientRect().x - leftPoint.getBoundingClientRect().x)
      nearest = nearest[0]
      distanceToNearest = nearest ? nearest.getBoundingClientRect().x - leftPoint.getBoundingClientRect().right + 2 : null
    } else if (this.catchPoint.classList.contains('right__point')) {
      let nearest = points.sort((a, b) => a.getBoundingClientRect().x - rightPoint.getBoundingClientRect().x > b.getBoundingClientRect().x - rightPoint.getBoundingClientRect().x)
      nearest = nearest[nearest.length - 1]
      distanceToNearest = nearest ? rightPoint.getBoundingClientRect().x - nearest.getBoundingClientRect().right : null
    }
    this.movePoint(this.catchPoint, distanceToNearest, leftPoint, rightPoint)
  }
  onRangeMouseDown(event) {
    if (event.button === 0) {
      this.mouse.left = true;

      this.mouse.startX = this.mouse.x;

      if (event.target.classList.contains('move__point')) {
        this.isPoint = true
        const coords = event.target.getBoundingClientRect()
        this.pointParams.startX = this.mouse.x - (this.mouse.x - coords.left)
        this.catchPoint = event.target
      }
    }
  }
  onMouseUp(event) {
    if (event.button === 0) {
      this.mouse.left = false
      this.isPoint = false;
    }
  }
  movePoint(element, distanceToNearest, leftPoint, rightPoint) {
    element.style.left = this.mouse.x - this.mouse.startX + this.pointParams.startX - this.lineCoords.x + 'px';
    /*
      Устанавливаем длину линии от передвигаемого элемента до ближайщей точки
      Если между двумя элементами нет точек, то у обоих убираем линии
    */
    if (distanceToNearest === null) {
      leftPoint.style.setProperty('--line-width', 0 + 'px')
      rightPoint.style.setProperty('--line-width', 0 + 'px')
    } else {
      element.style.setProperty('--line-width', distanceToNearest + 'px')
      element.style.setProperty('--left-pos', (distanceToNearest + 6) * - 1 + 'px')
    }
    /*
      Если передвигается левый элемент то ограничиваем движение между левой границей и правым элеменом,
      иначе ограничиваем движение между правой границей и левым элементом
    */
    const leftPointCoords = window.getComputedStyle(leftPoint)
    const rightPointCoords = window.getComputedStyle(rightPoint)

    if (element === leftPoint) {
      if (element.getBoundingClientRect().x <= this.lineCoords.x) {
        return element.style.left = 0 + 'px'
      } else if (element.getBoundingClientRect().right >= rightPoint.getBoundingClientRect().x) {
        return element.style.left = rightPointCoords.left.slice(0, rightPointCoords.left.length - 2) - element.getBoundingClientRect().width + 'px'
      }
    } else if (element === rightPoint) {
      if (element.getBoundingClientRect().right > this.lineCoords.x + this.lineCoords.width) {
        return element.style.left = this.lineCoords.width - element.getBoundingClientRect().width + 'px'
      } else if (element.getBoundingClientRect().x <= leftPoint.getBoundingClientRect().right) {
        return element.style.left = +leftPointCoords.left.slice(0, leftPointCoords.left.length - 2) + element.getBoundingClientRect().width + 'px'
      }
    }
    this.calculateMoveStyleUpdates(leftPointCoords, rightPointCoords)
  }

  calculateMoveStyleUpdates(leftPointCoords, rightPointCoords) {
    const pointsLineWidth = this.range.getBoundingClientRect().width;
    leftPointCoords = +leftPointCoords.left.slice(0, leftPointCoords.left.length - 2)
    rightPointCoords = +rightPointCoords.left.slice(0, rightPointCoords.left.length - 2)

    let lineNumbers = [...document.querySelectorAll('.line-number')]
    lineNumbers.map(el => {
      if (Number(el.dataset.value) >= leftPointCoords / pointsLineWidth && Number(el.dataset.value) <= rightPointCoords / pointsLineWidth) {
        el.classList.remove('disabled')
        el.classList.remove('active')
      } else if (Number(el.dataset.value) === +(leftPointCoords / pointsLineWidth).toFixed(2) || Number(el.dataset.value) === +(rightPointCoords / pointsLineWidth).toFixed(2)) {
        el.classList.add('active')
        el.classList.remove('disabled')
      } else {
        el.classList.add('disabled')
        el.classList.remove('active')
      }
    })
  }
  onQualityChoose(event) {
    if (event.target.tagName === 'SPAN') {
      document.querySelector('.quality-items__selected')?.classList?.remove('quality-items__selected')
      event.target.classList.add('quality-items__selected')
    }
  }
  onSelectOpen(event) {
    if (this.selectOpen) {
      this.selectedList.classList.remove('opened-select')
    } else {
      this.selectedList.classList.add('opened-select')
      this.updateSelectDropList()
    }
    this.selectOpen = !this.selectOpen
  }
  onSelectItemChoose(event) {
    event.stopPropagation()
    if (event.target.tagName == 'INPUT') {
      if (event.target.checked) {
        this.user.addOfferSkin(event)
      }else {
        this.user.removeFromOfferSkins(event)
      }
      this.updateSelectTopNames()
    }
  }
  onSkinSearch(event) {
    this.dropdown.innerHTML = ''
    if (event.target.value.trim().length) {
      this.dropdown.classList.add('visible-dropdown')
      const searched = this.user.skins.filter(skin => skin.name.toLowerCase().includes(event.target.value.toLowerCase()))
      searched.forEach(item => this.dropdown.insertAdjacentHTML('beforeend', this.getRenderSearchedData(item)))
    } else {
      this.dropdown.classList.remove('visible-dropdown')
    }
  }
  onDropdownClick(event) {
    if (event.target.classList.contains('dropdown-add-btn')) {
      this.user.clearChoosenSkin()
      this.user.addChoosenSkin(event)
      this.user.renderChoosenSkins()
      this.dropdown.classList.remove('visible-dropdown')
      this.searchInput.value = ''
    }
  }
  updateSelectDropList() {
    this.selectedList.innerHTML = ''
    this.user.skins.forEach(skin => this.selectedList.insertAdjacentHTML('beforeend', this.getRenderDropData(skin)))
  }
  updateSelectTopNames() {
    this.select.querySelector('.user-selected__skins').innerHTML = this.user.offerSkins.map(item => item.name.split('|')[0]).slice(0, 3)
  }
  getRenderSearchedData(skin) {
    const item = `
      <div class="dropdown__item">
        <img src=${skin.image} alt="skin">
        <div>
          <span>${skin.name.split('|')[0]}</span>
          <span>${skin.name.split('|')[1]}</span>
        </div>
        <img src="./assets/add.svg" class="dropdown-add-btn" name=${skin.id} alt="add">
      </div>
    `
    return item
  }
  getRenderDropData(skin) {
    const item = `
      <div class="dropdown__item">
        <img src=${skin.image} alt="skin">
        <div>
          <span>${skin.name.split('|')[0]}</span>
          <span>${skin.name.split('|')[1]}</span>
        </div>
        <input type="checkbox" ${this.user.offerSkins.includes(skin) && 'checked'} name=${skin.id}>
      </div>
    `
    return item
  }
}